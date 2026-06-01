'use client';

import { useState, useEffect } from 'react';
import type { Language } from '@/types/chat';
import { getLocalTranslation } from '@/lib/localTranslations';
import { getUiTranslation } from '@/lib/uiTranslations';

interface IssueOption {
  code: string;
  title: string;
}

interface IssueOptionsProps {
  issues: IssueOption[];
  onSelectIssue: (code: string) => void;
  onSelectOther: () => void;
  disabled?: boolean;
  selectedLanguage: Language;
}

function stripLeadingIcon(text: string): string {
  return text.replace(/^[^\p{L}\p{N}]+/u, '').trim();
}

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

export default function IssueOptions({
  issues,
  onSelectIssue,
  onSelectOther,
  disabled = false,
  selectedLanguage,
}: IssueOptionsProps) {
  const [translatedTitles, setTranslatedTitles] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [translatedOtherText, setTranslatedOtherText] = useState('My issue is different');

  useEffect(() => {
    async function loadTranslations() {
      if (selectedLanguage === 'en') {
        setTranslatedTitles({});
        setTranslatedOtherText('My issue is different');
        return;
      }
      setLoading(true);
      const translations: Record<string, string> = {};
      await Promise.all(
        issues.map(async (issue) => {
          const trans = await translateText(issue.title, selectedLanguage);
          translations[issue.code] = trans;
        })
      );
      const otherTrans = getUiTranslation('My issue is different', selectedLanguage);
      setTranslatedOtherText(otherTrans);
      setTranslatedTitles(translations);
      setLoading(false);
    }
    loadTranslations();
  }, [issues, selectedLanguage]);

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-card max-w-sm mx-auto animate-[slideInUp_0.25s_cubic-bezier(0.1,0.8,0.3,1)]">
      {/* Header banner */}
      <div className="bg-[#075e54] px-4 py-3 text-white text-sm font-semibold">
        {getUiTranslation('Select Your Issue', selectedLanguage)}
      </div>

      <div className="divide-y divide-slate-100 max-h-[300px] overflow-y-auto chat-scrollbar">
        {issues.map((issue) => {
          const displayTitle = stripLeadingIcon(translatedTitles[issue.code] || issue.title);
          return (
            <button
              key={issue.code}
              onClick={() => onSelectIssue(issue.code)}
              disabled={disabled || loading}
              className="w-full px-4 py-3.5 text-left hover:bg-emerald-50/60 transition-colors flex items-start gap-3 disabled:opacity-50 disabled:pointer-events-none group"
            >
              <span className="text-[11px] min-w-[44px] text-center px-2 py-1 bg-slate-100 text-slate-600 rounded-full font-bold mt-0.5 group-hover:bg-[#0f766e] group-hover:text-white transition-colors">
                {issue.code}
              </span>
              <span className="text-sm text-slate-700 font-medium leading-snug flex-1">
                {displayTitle}
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-4 h-4 text-slate-300 group-hover:text-[#0f766e] mt-0.5 transition-colors"
              >
                <path
                  fillRule="evenodd"
                  d="M7.21 14.77a.75.75 0 0 1 .02-1.06L11.168 10 7.23 6.29a.75.75 0 1 1 1.04-1.08l4.5 4.25a.75.75 0 0 1 0 1.08l-4.5 4.25a.75.75 0 0 1-1.06-.02Z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          );
        })}
      </div>

      {/* "My issue is different" item */}
      <div className="bg-slate-50 p-2.5 border-t border-slate-100 flex justify-center">
        <button
          onClick={onSelectOther}
          disabled={disabled || loading}
          className="text-xs font-semibold text-[#0f766e] hover:text-[#115e59] flex items-center gap-1.5 py-1.5 px-3 rounded-full hover:bg-emerald-50 transition-all disabled:opacity-50"
        >
          <span>✎</span>
          <span>{translatedOtherText}</span>
        </button>
      </div>
    </div>
  );
}
