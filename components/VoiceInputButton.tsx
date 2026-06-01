'use client';

/// <reference path="../types/web-speech.d.ts" />

import { useState, useRef, useEffect } from 'react';
import type { Language } from '@/types/chat';
import {
  startSpeechRecognition,
  stopSpeechRecognition,
  isSpeechRecognitionSupported,
} from '@/lib/speech';

interface VoiceInputButtonProps {
  onVoiceInput: (text: string) => void;
  onStart?: () => void;
  onError: (error: string) => void;
  selectedLanguage: Language;
  disabled?: boolean;
}

export default function VoiceInputButton({
  onVoiceInput,
  onStart,
  onError,
  selectedLanguage,
  disabled = false,
}: VoiceInputButtonProps) {
  const [isListening, setIsListening] = useState(false);
  const [supported, setSupported] = useState(true);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    setSupported(isSpeechRecognitionSupported());
  }, []);

  const handleStartListening = () => {
    if (disabled) return;
    onStart?.();
    setIsListening(true);
    recognitionRef.current = startSpeechRecognition(
      selectedLanguage,
      (text, isFinal) => {
        if (text && text.trim()) {
          onVoiceInput(text);
        }
      },
      () => {
        setIsListening(false);
      },
      (error) => {
        onError(error);
        setIsListening(false);
      }
    );
  };

  const handleStopListening = () => {
    if (recognitionRef.current) {
      stopSpeechRecognition(recognitionRef.current);
    }
    setIsListening(false);
  };

  if (!supported) {
    return null;
  }

  return (
    <button
      onClick={isListening ? handleStopListening : handleStartListening}
      disabled={disabled}
      className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
        isListening
          ? 'bg-red-500 hover:bg-red-600 text-white mic-pulse shadow-md scale-105'
          : 'bg-whatsapp-darkTeal hover:bg-whatsapp-teal text-white hover:shadow shadow-sm active:scale-95'
      } disabled:opacity-50 disabled:pointer-events-none shrink-0`}
      title={isListening ? 'Stop listening' : 'Start voice input'}
      type="button"
    >
      {isListening ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-5.5 h-5.5 animate-pulse"
        >
          <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
          <path d="M19 10a1 1 0 1 0-2 0 5 5 0 1 1-10 0 1 1 0 0 0-2 0 7 7 0 0 0 6 6.92V19a1 1 0 1 0 2 0v-2.08A7 7 0 0 0 19 10Z" />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-5.5 h-5.5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z"
          />
        </svg>
      )}
    </button>
  );
}
