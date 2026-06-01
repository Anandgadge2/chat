'use client';

import { useState } from 'react';
import type { Language } from '@/types/chat';
import { LANGUAGE_NAMES } from '@/types/chat';

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

export default function LanguageSelector({
  selectedLanguage,
  onLanguageChange,
  disabled = false,
}: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const languages = Object.entries(LANGUAGE_NAMES) as [Language, string][];

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
        className="p-2 hover:bg-black/10 rounded-full transition-colors flex items-center justify-center text-white disabled:opacity-50"
        title="Change Language"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-.778.099-1.533.284-2.253m0 0A17.919 17.919 0 0 0 12 10.5c2.998 0 5.74 1.1 7.843 2.918"
          />
        </svg>
      </button>

      {/* Bottom Sheet Backdrop & Modal */}
      {isOpen && (
        <>
          {/* Backdrop blur overlay */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-xs z-[100] transition-opacity"
            onClick={() => setIsOpen(false)}
          />

          {/* Slide-up panel */}
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl z-[101] shadow-2xl overflow-hidden animate-[slideInUp_0.3s_cubic-bezier(0.1,0.8,0.3,1)_forwards] flex flex-col max-h-[75%]">
            {/* Header Drag Handle / Border top Indicator */}
            <div className="flex justify-center py-2 bg-neutral-50 border-b border-neutral-100">
              <div className="w-10 h-1 bg-neutral-300 rounded-full" />
            </div>

            {/* Header Title */}
            <div className="px-5 py-3 flex items-center justify-between border-b border-neutral-100">
              <h3 className="font-semibold text-neutral-800 text-lg">Choose Language</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-full hover:bg-neutral-100 text-neutral-500 transition-colors"
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
            <div className="p-4 overflow-y-auto chat-scrollbar flex-1 max-h-[350px]">
              <div className="grid grid-cols-2 gap-2">
                {languages.map(([code, name]) => {
                  const isSelected = selectedLanguage === code;
                  return (
                    <button
                      key={code}
                      onClick={() => handleSelectLanguage(code)}
                      className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'border-whatsapp-darkTeal bg-whatsapp-lightGreen/40 font-semibold text-whatsapp-darkTeal shadow-sm'
                          : 'border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 text-neutral-700'
                      }`}
                    >
                      <span className="text-xl" role="img" aria-label={name}>
                        {LANGUAGE_EMOJIS[code]}
                      </span>
                      <div className="flex flex-col flex-1 min-w-0">
                        <span className="text-sm truncate font-medium">{name}</span>
                        <span className="text-[10px] text-neutral-400 capitalize">
                          {code === 'en' ? 'English' : code}
                        </span>
                      </div>
                      {isSelected && (
                        <span className="text-whatsapp-darkTeal">
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
        </>
      )}
    </div>
  );
}
