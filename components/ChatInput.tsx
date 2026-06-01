'use client';

import { useState, useEffect } from 'react';
import VoiceInputButton from './VoiceInputButton';
import type { Language } from '@/types/chat';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  selectedLanguage: Language;
  disabled?: boolean;
  placeholder?: string;
}

async function translateText(text: string, targetLanguage: Language): Promise<string> {
  if (targetLanguage === 'en') return text;
  try {
    const response = await fetch('/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, targetLanguage, sourceLanguage: 'en' }),
    });
    if (!response.ok) return text;
    const data = await response.json();
    if (data.success && data.data?.translatedText) {
      return data.data.translatedText;
    }
    return text;
  } catch (error) {
    console.error('Translation failed:', error);
    return text;
  }
}

export default function ChatInput({
  onSendMessage,
  selectedLanguage,
  disabled = false,
  placeholder = 'Type your issue here...',
}: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [originalMessage, setOriginalMessage] = useState('');
  const [translatedPlaceholder, setTranslatedPlaceholder] = useState(placeholder);

  useEffect(() => {
    async function translatePlaceholder() {
      if (selectedLanguage === 'en') {
        setTranslatedPlaceholder('Type a message...');
        return;
      }
      const trans = await translateText('Type a message...', selectedLanguage);
      setTranslatedPlaceholder(trans);
    }
    translatePlaceholder();
  }, [selectedLanguage]);

  const handleSendMessage = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
      setOriginalMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleVoiceInput = (text: string) => {
    setMessage(originalMessage ? `${originalMessage} ${text}` : text);
  };

  const hasText = message.trim().length > 0;

  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-transparent select-none">
      {/* Left Input Capsule (White bubble like WhatsApp) */}
      <div className="flex-1 bg-white rounded-full px-3 py-1 flex items-center shadow-sm border border-neutral-100 min-w-0">
        {/* Emoji Button Icon */}
        <button
          type="button"
          className="p-1.5 text-neutral-400 hover:text-neutral-500 transition-colors shrink-0"
          title="Emojis"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z"
            />
          </svg>
        </button>

        {/* Text Input */}
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder={translatedPlaceholder}
          disabled={disabled}
          className="flex-1 min-w-0 bg-transparent py-2.5 px-2 text-sm text-neutral-800 placeholder-neutral-400 focus:outline-none disabled:opacity-50"
        />

        {/* Attachment Pin Icon */}
        <button
          type="button"
          className="p-1.5 text-neutral-400 hover:text-neutral-500 transition-colors shrink-0"
          title="Attach file"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5.5 h-5.5 rotate-45"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13"
            />
          </svg>
        </button>
      </div>

      {/* Right Action Button (Voice Input toggles with Send Button) */}
      <div className="shrink-0">
        {hasText ? (
          <button
            onClick={handleSendMessage}
            disabled={disabled}
            className="w-11 h-11 rounded-full bg-[#00a884] hover:bg-[#008f72] text-white flex items-center justify-center shadow-md active:scale-95 transition-all"
            type="button"
            title="Send message"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5 translate-x-[2px]"
            >
              <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
            </svg>
          </button>
        ) : (
          <VoiceInputButton
            onVoiceInput={handleVoiceInput}
            onStart={() => setOriginalMessage(message)}
            onError={(error) => {
              console.error('Voice input error:', error);
            }}
            selectedLanguage={selectedLanguage}
            disabled={disabled}
          />
        )}
      </div>
    </div>
  );
}
