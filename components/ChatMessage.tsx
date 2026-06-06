'use client';

import { useEffect, useRef, useState } from 'react';
import type { ChatMessage as ChatMessageType } from '@/types/support';
import type { Language } from '@/types/chat';
import { speakText, stopSpeaking, isSpeechSynthesisSupported } from '@/lib/speech';

interface ChatMessageProps {
  message: ChatMessagePropsMessage;
  selectedLanguage: Language;
}

// Use local type helper to avoid typescript warning or build error
type ChatMessagePropsMessage = {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date | string;
  issueCode?: string;
  language?: string;
};

export default function ChatMessage({
  message,
  selectedLanguage,
}: ChatMessageProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    setSpeechSupported(isSpeechSynthesisSupported());
    return () => {
      stopSpeaking();
    };
  }, []);

  const handleSpeak = () => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      utteranceRef.current = speakText(
        message.content,
        selectedLanguage,
        () => setIsSpeaking(false),
        () => setIsSpeaking(false)
      );
    }
  };

  const isUser = message.type === 'user';
  
  // Format timestamp (HH:MM)
  const formatTime = (dateInput: Date | string) => {
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    try {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    } catch {
      return '12:00';
    }
  };

  // Prettify solution formatting
  const renderFormattedContent = (content: string) => {
    // If it has lines, style them elegantly
    const lines = content.split('\n');
    return lines.map((line, index) => {
      if (line.startsWith('Possible Reason:')) {
        return null;
      }
      if (line.match(/^\d+\./)) {
        return (
          <div key={index} className="flex gap-2 text-sm leading-relaxed text-slate-600 py-0.5 pl-1">
            <span className="font-bold text-[#0f766e]">{line.match(/^\d+\./)?.[0]}</span>
            <span className="flex-1">{line.replace(/^\d+\.\s*/, '')}</span>
          </div>
        );
      }
      if (line.startsWith('Here is the solution:') || line.startsWith('Steps to resolve:')) {
        return (
          <p key={index} className="text-sm font-bold text-slate-800 mt-2 mb-1">
            {line}
          </p>
        );
      }
      return (
        <p key={index} className="text-sm text-slate-600 leading-relaxed mb-1.5 break-words">
          {line}
        </p>
      );
    });
  };

  return (
    <div className={`flex items-start gap-1.5 mb-3.5 w-full ${isUser ? 'justify-end' : 'justify-start'}`}>
      {/* Bot Avatar */}
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-[#075e54] flex items-center justify-center text-white text-[10px] font-bold shadow-soft select-none shrink-0 mt-1">
          PA
        </div>
      )}

      {/* Message Bubble wrapper with spacing to accommodate CSS tail */}
      <div className={`flex flex-col max-w-[78%] relative ${isUser ? 'mr-2' : 'ml-2'}`}>
        <div className={`px-3.5 py-2.5 ${isUser ? 'bubble-out' : 'bubble-in'}`}>
          {/* Main Content */}
          <div className="text-sm leading-normal">
            {isUser ? (
              <p className="text-slate-800 font-medium break-words leading-normal">{message.content}</p>
            ) : (
              <div className="space-y-0.5">{renderFormattedContent(message.content)}</div>
            )}
          </div>

          {/* Footer Info (Speak Button + Time + Checkmarks) */}
          <div className="flex items-center justify-end gap-1.5 mt-1.5 text-[9px] text-slate-400 select-none">
            {/* Audio Button inside Bubble */}
            {!isUser && speechSupported && (
              <button
                onClick={handleSpeak}
                className={`p-1 rounded-full ${
                  isSpeaking ? 'bg-red-50 text-red-500 animate-pulse' : 'hover:bg-slate-100 text-slate-400'
                } transition-colors mr-auto`}
                title={isSpeaking ? 'Stop Audio' : 'Play Audio'}
              >
                {isSpeaking ? (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                    <path d="M5.75 3a.75.75 0 0 0-.75.75v12.5c0 .414.336.75.75.75h1.5a.75.75 0 0 0 .75-.75V3.75A.75.75 0 0 0 7.25 3h-1.5ZM12.75 3a.75.75 0 0 0-.75.75v12.5c0 .414.336.75.75.75h1.5a.75.75 0 0 0 .75-.75V3.75a.75.75 0 0 0-.75-.75h-1.5Z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                    <path d="M10 3.75a.75.75 0 0 0-1.264-.546L5.328 6.5H3.75A1.75 1.75 0 0 0 2 8.25v3.5C2 12.716 2.784 13.5 3.75 13.5h1.578l3.408 3.296A.75.75 0 0 0 10 16.25V3.75ZM13.5 10a3.5 3.5 0 0 0-1.75-3.031.75.75 0 1 0-.75 1.299 2 2 0 0 1 0 3.464.75.75 0 1 0 .75 1.3A3.5 3.5 0 0 0 13.5 10ZM16.25 10a6.25 6.25 0 0 0-3.125-5.413.75.75 0 1 0-.75 1.3 4.75 4.75 0 0 1 0 8.226.75.75 0 1 0 .75 1.3A6.25 6.25 0 0 0 16.25 10Z" />
                  </svg>
                )}
              </button>
            )}

            <span>{formatTime(message.timestamp)}</span>

            {isUser && (
              <span className="text-[#0f766e] font-bold tracking-tight -ml-0.5">
                ✓✓
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
