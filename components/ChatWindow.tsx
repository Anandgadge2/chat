'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import CategorySelector from './CategorySelector';
import IssueOptions from './IssueOptions';
import FeedbackButtons from './FeedbackButtons';
import SupportDetailsForm from './SupportDetailsForm';
import LanguageSelector from './LanguageSelector';
import type { ChatMessage as ChatMessageType, ChatSession, MatchIssueResponse } from '@/types/support';
import type { Language, ApiResponse } from '@/types/chat';
import {
  WELCOME_MESSAGE,
  SOMETHING_ELSE_MESSAGE,
  LOW_CONFIDENCE_MESSAGE,
  NO_MATCH_MESSAGE,
  ESCALATION_MESSAGE,
  HELPFUL_YES_MESSAGE,
  SUCCESS_MESSAGE,
  CONFIDENCE_THRESHOLDS,
  SOLUTION_HEADER,
  POSSIBLE_REASON_PREFIX,
  STEPS_PREFIX,
} from '@/lib/constants';
import {
  getSupportIssueByCode,
  getCategories,
  getIssuesByCategory,
} from '@/lib/supportIssues';
import { logError, logInfo } from '@/lib/logger';
import { getUiTranslation } from '@/lib/uiTranslations';

type ChatFlow =
  | 'welcome'
  | 'category'
  | 'issue'
  | 'solution'
  | 'feedback'
  | 'escalation'
  | 'success';

interface ChatWindowProps {
  onSessionClose?: (session: ChatSession) => void;
}

import { getLocalTranslation } from '@/lib/localTranslations';

// Client-side translation helper
async function translateMessage(
  text: string,
  targetLanguage: Language
): Promise<string> {
  if (targetLanguage === 'en') return text;

  // Try local dictionary first (guarantees dynamic lang change for standard phrases)
  const localTranslation = getLocalTranslation(text, targetLanguage);
  if (localTranslation !== text) {
    return localTranslation;
  }

  try {
    const response = await fetch('/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text,
        targetLanguage,
        sourceLanguage: 'en',
      }),
    });

    if (!response.ok) return text;

    const data = await response.json();
    if (data.success && data.data?.translatedText) {
      return data.data.translatedText;
    }
    return text;
  } catch (error) {
    console.error('Translation failed, using original text:', error);
    return text;
  }
}

export default function ChatWindow({ onSessionClose }: ChatWindowProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [session, setSession] = useState<ChatSession>({
    id: uuidv4(),
    language: 'en',
    startedAt: new Date(),
    messages: [],
    status: 'active',
  });
  const [flow, setFlow] = useState<ChatFlow>('welcome');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedIssueCode, setSelectedIssueCode] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('en');
  const hasInitialized = useRef(false);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  useEffect(() => {
    scrollToBottom();
  }, [session.messages, flow, showFeedback]);

  const addBotMessage = useCallback(
    async (content: string, issueCode?: string) => {
      // Translate if not English
      const translatedContent = await translateMessage(content, selectedLanguage);

      const message: ChatMessageType = {
        id: uuidv4(),
        type: 'assistant',
        content: translatedContent,
        timestamp: new Date(),
        issueCode,
        language: selectedLanguage,
      };

      setSession((prev) => ({
        ...prev,
        messages: [...prev.messages, message],
      }));
    },
    [selectedLanguage]
  );

  const addUserMessage = useCallback(
    (content: string) => {
      const message: ChatMessageType = {
        id: uuidv4(),
        type: 'user',
        content,
        timestamp: new Date(),
        language: selectedLanguage,
      };

      setSession((prev) => ({
        ...prev,
        messages: [...prev.messages, message],
      }));
    },
    [selectedLanguage]
  );

  // Show welcome message on mount
  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      addBotMessage(WELCOME_MESSAGE);
    }
  }, [addBotMessage]);

  const handleCategorySelect = async (category: string) => {
    setSelectedCategory(category);
    addUserMessage(category);
    showIssueOptions(category);
  };

  const showIssueOptions = (category: string) => {
    const issues = getIssuesByCategory(category);
    setFlow('issue');
  };

  const handleIssueSelect = async (code: string) => {
    setSelectedIssueCode(code);
    const issue = getSupportIssueByCode(code);

    if (!issue) {
      await addBotMessage('Issue not found. Please try again.');
      return;
    }

    addUserMessage(issue.title);
    setIsLoading(true);

    try {
      // Call the AI solution formatter API route
      const response = await fetch('/api/chat/format-solution', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          issueTitle: issue.title,
          possibleReason: issue.possibleReason,
          solutionSteps: issue.solutionSteps,
          targetLanguage: selectedLanguage,
        }),
      });

      const data = await response.json();
      if (data.success && data.data) {
        const message: ChatMessageType = {
          id: uuidv4(),
          type: 'assistant',
          content: data.data,
          timestamp: new Date(),
          issueCode: code,
          language: selectedLanguage,
        };
        setSession((prev) => ({
          ...prev,
          messages: [...prev.messages, message],
        }));
      } else {
        // Fallback to client-side concatenated translation if API fails
        let solutionContent = `${SOLUTION_HEADER}\n\n`;
        solutionContent += `${POSSIBLE_REASON_PREFIX} ${issue.possibleReason}\n\n`;
        solutionContent += `${STEPS_PREFIX}\n`;
        issue.solutionSteps.forEach((step) => {
          solutionContent += `${step}\n`;
        });
        await addBotMessage(solutionContent, code);
      }
    } catch (err) {
      console.error('Error formatting solution with AI:', err);
      // Fallback
      let solutionContent = `${SOLUTION_HEADER}\n\n`;
      solutionContent += `${POSSIBLE_REASON_PREFIX} ${issue.possibleReason}\n\n`;
      solutionContent += `${STEPS_PREFIX}\n`;
      issue.solutionSteps.forEach((step) => {
        solutionContent += `${step}\n`;
      });
      await addBotMessage(solutionContent, code);
    } finally {
      setIsLoading(false);
      setFlow('feedback');
      setShowFeedback(true);
    }
  };

  const handleFreetextInput = async (message: string) => {
    addUserMessage(message);
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/chat/match-issue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          selectedLanguage,
        }),
      });

      const data = (await response.json()) as ApiResponse<MatchIssueResponse>;

      if (!data.success || !data.data) {
        await addBotMessage(NO_MATCH_MESSAGE);
        setFlow('escalation');
        setIsLoading(false);
        return;
      }

      const matchResult = data.data as {
        matchedCode: string;
        confidence: number;
      };

      logInfo('Issue matched', { code: matchResult.matchedCode, confidence: matchResult.confidence });

      if (matchResult.confidence >= CONFIDENCE_THRESHOLDS.HIGH) {
        // High confidence - show solution
        await handleIssueSelect(matchResult.matchedCode);
      } else if (
        matchResult.confidence >= CONFIDENCE_THRESHOLDS.MEDIUM
      ) {
        // Medium confidence - show solution
        await handleIssueSelect(matchResult.matchedCode);
      } else {
        // Low confidence - escalate
        await addBotMessage(NO_MATCH_MESSAGE);
        setFlow('escalation');
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      logError('Error matching issue', { error: errorMsg });
      setError(
        'Failed to match issue. Please describe it differently or select a category.'
      );
      await addBotMessage(
        'Sorry, I encountered an error. Please select a category to continue.'
      );
      setFlow('welcome');
    } finally {
      setIsLoading(false);
    }
  };

  const handleYesFeedback = async () => {
    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: session.id,
          issueCode: selectedIssueCode,
          helpful: true,
          selectedLanguage,
        }),
      });

      await addBotMessage(HELPFUL_YES_MESSAGE);
      setShowFeedback(false);
      setFlow('success');
      setSession((prev) => ({ ...prev, status: 'resolved' }));
    } catch (err) {
      logError('Error recording feedback', { error: err });
    }
  };

  const handleNoFeedback = async () => {
    await addBotMessage(ESCALATION_MESSAGE);
    setShowFeedback(false);
    setFlow('escalation');
  };

  const handleEscalationSubmit = async (details: any) => {
    setIsLoading(true);

    try {
      const response = await fetch('/api/support-ticket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: session.id,
          ...details,
          matchedIssueCode: selectedIssueCode,
          conversationHistory: session.messages,
        }),
      });

      if (response.ok) {
        await addBotMessage(SUCCESS_MESSAGE);
        setFlow('success');
        setSession((prev) => ({ ...prev, status: 'escalated' }));
      } else {
        setError('Failed to submit. Please try again.');
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      logError('Error submitting escalation', { error: errorMsg });
      setError('Failed to submit support ticket. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = async () => {
    setSession({
      id: uuidv4(),
      language: selectedLanguage,
      startedAt: new Date(),
      messages: [],
      status: 'active',
    });
    setFlow('welcome');
    setSelectedCategory(null);
    setSelectedIssueCode(null);
    setShowFeedback(false);
    setError(null);
    // Use setTimeout to ensure state is cleared before adding new message
    setTimeout(() => {
      addBotMessage(WELCOME_MESSAGE);
    }, 0);
  };

  const handleLanguageChange = async (language: Language) => {
    setSelectedLanguage(language);
    // Show a fresh welcome message in the new language
    const translatedWelcome = await translateMessage(WELCOME_MESSAGE, language);
    setSession({
      id: uuidv4(),
      language,
      startedAt: new Date(),
      messages: [
        {
          id: uuidv4(),
          type: 'assistant',
          content: translatedWelcome,
          timestamp: new Date(),
          language: language,
        },
      ],
      status: 'active',
    });
    setFlow('welcome');
    setSelectedCategory(null);
    setSelectedIssueCode(null);
    setShowFeedback(false);
    setError(null);
  };

  return (
    <div className="flex flex-col h-full w-full relative overflow-hidden bg-transparent select-none">
      {/* Chat support header */}
      <div className="bg-[#075e54] text-white px-4 py-3 flex items-center justify-between shadow-[0_8px_24px_rgba(15,23,42,0.12)] shrink-0 z-[200] sm:pt-9">
        <div className="flex items-center gap-3">
          {/* Back Icon */}
          <button className="p-1.5 hover:bg-white/10 rounded-full transition-colors hidden sm:block text-white/80 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
          </button>
          
          {/* Bot avatar */}
          <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center text-lg shadow-soft ring-2 ring-white/20">
            <span className="text-white text-sm font-bold">PA</span>
          </div>
          
          {/* User Status details */}
          <div className="flex flex-col">
            <span className="font-semibold text-sm text-white leading-tight">PugArch Support</span>
            <span className="text-[10px] text-white/70 flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              online
            </span>
          </div>
        </div>
        
        {/* Globe Language Picker */}
        <div>
          <LanguageSelector
            selectedLanguage={selectedLanguage}
            onLanguageChange={handleLanguageChange}
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Chat Messages scrolled area — KEY FIX: min-h-0 enables flex child scrolling */}
      <div
        ref={scrollContainerRef}
        className="flex-1 min-h-0 overflow-y-auto whatsapp-bg chat-scrollbar px-4 py-4 space-y-1"
      >
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-xs font-semibold shadow-sm flex items-start gap-1.5 animate-[fadeIn_0.2s_ease-out]">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {session.messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message}
            selectedLanguage={selectedLanguage}
          />
        ))}

        {isLoading && (
          <div className="flex justify-start mb-4 animate-[slideInLeft_0.2s_ease-out]">
            <div className="w-8 h-8 rounded-full bg-[#075e54] flex items-center justify-center text-xs font-bold shrink-0 mt-1 select-none shadow-soft">
              <span className="text-white text-[10px] font-bold">PA</span>
            </div>
            <div className="ml-2 bg-white px-4 py-3 rounded-2xl rounded-tl-none shadow-soft border border-slate-100 flex items-center gap-1.5 select-none max-w-[200px]">
              {/* Bouncing dots typing indicator */}
              <div className="w-2 h-2 rounded-full bg-[#0f766e] dot-bounce-1" />
              <div className="w-2 h-2 rounded-full bg-[#0f766e] dot-bounce-2" />
              <div className="w-2 h-2 rounded-full bg-[#0f766e] dot-bounce-3" />
            </div>
          </div>
        )}

        {/* Interactive Chat Selection Options rendered inside scroll flow */}
        {flow !== 'success' && (
          <div className="py-2.5 w-full z-10 shrink-0">
            {flow === 'welcome' && (
              <CategorySelector
                categories={getCategories()}
                onSelectCategory={handleCategorySelect}
                disabled={isLoading}
                selectedLanguage={selectedLanguage}
              />
            )}

            {flow === 'issue' && selectedCategory && (
              <IssueOptions
                issues={getIssuesByCategory(selectedCategory).map((issue) => ({
                  code: issue.code,
                  title: issue.title,
                }))}
                onSelectIssue={handleIssueSelect}
                onSelectOther={() => {
                  addBotMessage(SOMETHING_ELSE_MESSAGE);
                  setFlow('solution');
                }}
                disabled={isLoading}
                selectedLanguage={selectedLanguage}
              />
            )}

            {flow === 'feedback' && showFeedback && (
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-card max-w-sm mx-auto space-y-2 animate-[slideInUp_0.25s_cubic-bezier(0.1,0.8,0.3,1)]">
                <p className="text-sm font-semibold text-slate-700 text-center">
                  {getUiTranslation('Was this helpful?', selectedLanguage)}
                </p>
                <FeedbackButtons
                  onYes={handleYesFeedback}
                  onNo={handleNoFeedback}
                  disabled={isLoading}
                  selectedLanguage={selectedLanguage}
                />
              </div>
            )}

            {flow === 'escalation' && (
              <SupportDetailsForm
                onSubmit={handleEscalationSubmit}
                onCancel={handleReset}
                isLoading={isLoading}
                selectedLanguage={selectedLanguage}
              />
            )}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Start New Chat Button */}
      {flow === 'success' && (
        <div className="px-4 py-3 bg-transparent z-10 shrink-0">
          <button
            onClick={handleReset}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#0f766e] hover:bg-[#115e59] text-white font-semibold rounded-full shadow-card transition-all active:scale-[0.98]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
            <span>{getUiTranslation('Start New Chat', selectedLanguage)}</span>
          </button>
        </div>
      )}

      {/* Bottom Message Input capsule */}
      {(flow === 'solution' || flow === 'welcome' || flow === 'issue') && (
        <div className="shrink-0 bg-white/80 backdrop-blur-sm border-t border-slate-100 pb-3 pt-1">
          <ChatInput
            onSendMessage={handleFreetextInput}
            selectedLanguage={selectedLanguage}
            disabled={isLoading}
          />
        </div>
      )}

      {/* Portal target for language selector modal */}
      <div id="language-selector-portal" />
    </div>
  );
}
