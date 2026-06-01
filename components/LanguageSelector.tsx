'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { Language } from '@/types/chat';
import { LANGUAGE_NAMES } from '@/types/chat';
import { getUiTranslation } from '@/lib/uiTranslations';

interface LanguageSelectorProps {
  selectedLanguage: Language;
  onLanguageChange: (language: Language) => void;
  disabled?: boolean;
}

// Map languages to flags/icons for high fidelity UI
const LANGUAGE_EMOJIS: Record<Language, string> = {
  en: '🇺🇸',
  hi: '🇮🇳',
  mr: '🇮🇳',
  or: '🇮🇳',
  bn: '🇮🇳',
  ta: '🇮🇳',
  te: '🇮🇳',
  kn: '🇮🇳',
  gu: '🇮🇳',
};

const LANGUAGE_SUBTITLES: Record<Language, string> = {
  en: 'English',
  hi: 'Hindi',
  mr: 'Marathi',
  or: 'Odia',
  bn: 'Bengali',
  ta: 'Tamil',
  te: 'Telugu',
  kn: 'Kannada',
  gu: 'Gujarati',
};

export default function LanguageSelector({
  selectedLanguage,
  onLanguageChange,
  disabled = false,
}: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const languages = Object.entries(LANGUAGE_NAMES) as [Language, string][];

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const handleSelectLanguage = (lang: Language) => {
    if (disabled) return;
    onLanguageChange(lang);
    setIsOpen(false);
  };

  return (
    <div>
      {/* Globe Trigger Button */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(true)}
        disabled={disabled}
        className="h-10 w-10 rounded-full border border-white/15 bg-white/10 text-white/90 transition-colors hover:bg-white/20 disabled:opacity-50 flex items-center justify-center"
        title="Change Language"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5.5 h-5.5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-.778.099-1.533.284-2.253m0 0A17.919 17.919 0 0 0 12 10.5c2.998 0 5.74 1.1 7.843 2.918"
          />
        </svg>
      </button>

      {/* Bottom Sheet Backdrop & Modal */}
      {isOpen && mounted && typeof document !== 'undefined'
        ? createPortal(
            <>
              {/* Backdrop blur overlay */}
              <div
                className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm z-[900] transition-opacity"
                onClick={() => setIsOpen(false)}
              />

              {/* Slide-up panel */}
              <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[28px] z-[901] shadow-elevated overflow-hidden animate-[slideInUp_0.3s_cubic-bezier(0.1,0.8,0.3,1)_forwards] flex flex-col max-h-[78%]">
                {/* Header Drag Handle */}
                <div className="flex justify-center py-2.5 bg-slate-50 border-b border-slate-100">
                  <div className="w-10 h-1 bg-slate-300 rounded-full" />
                </div>

                {/* Header Title */}
                <div className="px-5 py-3 flex items-center justify-between border-b border-slate-100">
                  <h3 className="font-semibold text-slate-900 text-lg">
                    {getUiTranslation('Choose Language', selectedLanguage)}
                  </h3>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Language grid list */}
                <div className="p-4 overflow-y-auto chat-scrollbar flex-1 max-h-[380px]">
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {languages.map(([code, name]) => {
                      const isSelected = selectedLanguage === code;
                      return (
                        <button
                          key={code}
                          onClick={() => handleSelectLanguage(code)}
                          disabled={disabled}
                          className={`flex min-h-[64px] items-center gap-3 rounded-2xl border p-3 text-left transition-all disabled:opacity-50 ${
                            isSelected
                              ? 'border-[#0f766e] bg-emerald-50 font-semibold text-[#0f766e] shadow-soft'
                              : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <span className="text-xl" role="img" aria-label={name}>
                            {LANGUAGE_EMOJIS[code]}
                          </span>
                          <div className="flex flex-col flex-1 min-w-0">
                            <span className="text-sm truncate font-medium">{name}</span>
                            <span className="text-[11px] text-slate-500">
                              {LANGUAGE_SUBTITLES[code]}
                            </span>
                          </div>
                          {isSelected && (
                            <span className="text-[#0f766e]">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="w-5 h-5"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </>,
            document.getElementById('language-selector-portal') || document.body
          )
        : null}
    </div>
  );
}
