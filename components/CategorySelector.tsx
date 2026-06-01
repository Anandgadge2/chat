'use client';

import { useState, useEffect } from 'react';
import type { Language } from '@/types/chat';
import { getLocalTranslation } from '@/lib/localTranslations';
import { getUiTranslation } from '@/lib/uiTranslations';

interface CategorySelectorProps {
  categories: string[];
  onSelectCategory: (category: string) => void;
  disabled?: boolean;
  selectedLanguage: Language;
}

const CATEGORY_ICONS: Record<string, string> = {
  'Login & Account': '🔐',
  'Location, GPS & Geofence': '📍',
  'Attendance & Tracking': '📋',
  'App Crashes & Performance': '💥',
  'Data & Sync': '🔄',
};

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

export default function CategorySelector({
  categories,
  onSelectCategory,
  disabled = false,
  selectedLanguage,
}: CategorySelectorProps) {
  const [translatedCategories, setTranslatedCategories] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadTranslations() {
      if (selectedLanguage === 'en') {
        setTranslatedCategories({});
        return;
      }
      setLoading(true);
      const translations: Record<string, string> = {};
      await Promise.all(
        categories.map(async (category) => {
          const trans = await translateText(category, selectedLanguage);
          translations[category] = trans;
        })
      );
      setTranslatedCategories(translations);
      setLoading(false);
    }
    loadTranslations();
  }, [categories, selectedLanguage]);

  return (
    <div className="w-full max-w-sm mx-auto rounded-2xl border border-slate-200 bg-white shadow-card overflow-hidden animate-[fadeIn_0.3s_ease-out]">
      <div className="px-4 py-3 border-b border-slate-100">
        <p className="text-sm font-semibold text-slate-900">
          {getUiTranslation('How can I help?', selectedLanguage)}
        </p>
      </div>
      {categories.map((category) => {
        const icon = CATEGORY_ICONS[category] || '💡';
        const displayLabel = stripLeadingIcon(translatedCategories[category] || category);
        return (
          <button
            key={category}
            onClick={() => onSelectCategory(category)}
            disabled={disabled || loading}
            className="w-full flex items-center gap-3 px-4 py-3 text-left border-b border-slate-100 last:border-b-0 hover:bg-emerald-50/60 transition-colors text-sm font-medium text-slate-700 active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none group"
          >
            <span className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-base group-hover:bg-white">
              {icon}
            </span>
            <span className="flex-1 leading-snug">{displayLabel}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-4 h-4 text-slate-300 group-hover:text-[#0f766e] transition-colors"
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
  );
}
