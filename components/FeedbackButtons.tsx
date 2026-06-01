'use client';

import { useState, useEffect } from 'react';
import type { Language } from '@/types/chat';

interface FeedbackButtonsProps {
  onYes: () => void;
  onNo: () => void;
  disabled?: boolean;
  selectedLanguage: Language;
}

import { getLocalTranslation } from '@/lib/localTranslations';

async function translateText(text: string, targetLanguage: Language): Promise<string> {
  if (targetLanguage === 'en') return text;

  // Try local dictionary first
  const localTranslation = getLocalTranslation(text, targetLanguage);
  if (localTranslation !== text) {
    return localTranslation;
  }

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

export default function FeedbackButtons({
  onYes,
  onNo,
  disabled = false,
  selectedLanguage,
}: FeedbackButtonsProps) {
  const [yesText, setYesText] = useState('Yes');
  const [noText, setNoText] = useState('No');

  useEffect(() => {
    async function translateLabels() {
      if (selectedLanguage === 'en') {
        setYesText('Yes');
        setNoText('No');
        return;
      }
      const yTrans = await translateText('Yes', selectedLanguage);
      const nTrans = await translateText('No', selectedLanguage);
      setYesText(yTrans);
      setNoText(nTrans);
    }
    translateLabels();
  }, [selectedLanguage]);

  return (
    <div className="flex gap-3 mt-3 w-full max-w-xs mx-auto">
      <button
        onClick={onYes}
        disabled={disabled}
        className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold rounded-full shadow-soft transition-all hover:shadow-card active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="w-4 h-4"
        >
          <path
            fillRule="evenodd"
            d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
            clipRule="evenodd"
          />
        </svg>
        <span>{yesText}</span>
      </button>
      <button
        onClick={onNo}
        disabled={disabled}
        className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold rounded-full transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="w-4 h-4"
        >
          <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
        </svg>
        <span>{noText}</span>
      </button>
    </div>
  );
}
