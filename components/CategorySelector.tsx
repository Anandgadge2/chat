'use client';

import { useState, useEffect } from 'react';
import type { Language } from '@/types/chat';

interface CategorySelectorProps {
  categories: string[];
  onSelectCategory: (category: string) => void;
  disabled?: boolean;
  selectedLanguage: Language;
}

const CATEGORY_ICONS: Record<string, string> = {
  'Login & Account': '🔐',
  'Location, GPS & Geofence': '📍',
  'Attendance & Check-in': '📋',
  'App Crashes & Errors': '💥',
  'Sync & Data Issues': '🔄',
};

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
    <div className="flex flex-wrap gap-2 py-2 px-1 justify-center animate-[fadeIn_0.3s_ease-out]">
      {categories.map((category) => {
        const icon = CATEGORY_ICONS[category] || '💡';
        const displayLabel = translatedCategories[category] || category;
        return (
          <button
            key={category}
            onClick={() => onSelectCategory(category)}
            disabled={disabled || loading}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-neutral-200 hover:border-whatsapp-darkTeal hover:bg-whatsapp-lightGreen/10 rounded-full transition-all text-sm font-medium text-neutral-800 shadow-sm active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
          >
            <span>{icon}</span>
            <span>{displayLabel}</span>
          </button>
        );
      })}
    </div>
  );
}
