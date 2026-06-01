import type { Language } from '@/types/chat';

// Language codes for Web Speech API
const LANGUAGE_CODES: Record<Language, string> = {
  en: 'en-US',
  hi: 'hi-IN',
  mr: 'mr-IN',
  or: 'or-IN',
  bn: 'bn-IN',
  ta: 'ta-IN',
  te: 'te-IN',
  kn: 'kn-IN',
  gu: 'gu-IN',
};

// Errors that should be silently ignored (not shown to user)
const SILENT_ERRORS = new Set(['no-speech', 'aborted']);

export function startSpeechRecognition(
  language: Language,
  onResult: (text: string, isFinal: boolean) => void,
  onEnd: () => void,
  onError: (error: string) => void
): SpeechRecognition | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const SpeechRecognitionCtor =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition ||
    (window as any).mozSpeechRecognition ||
    (window as any).msSpeechRecognition;

  if (!SpeechRecognitionCtor) {
    onError('Speech recognition is not supported on this browser');
    return null;
  }

  const recognition = new SpeechRecognitionCtor();
  recognition.lang = LANGUAGE_CODES[language] || 'en-US';
  recognition.continuous = true; // Use continuous listening to prevent early stops
  recognition.interimResults = true;
  recognition.maxAlternatives = 1;

  recognition.onstart = () => {
    console.log('Speech recognition started');
  };

  recognition.onresult = (event: SpeechRecognitionEvent) => {
    let interimTranscript = '';
    let finalTranscript = '';

    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;

      if (event.results[i].isFinal) {
        finalTranscript += transcript + ' ';
      } else {
        interimTranscript += transcript;
      }
    }

    const result = finalTranscript.trim() || interimTranscript.trim();
    const isFinal = finalTranscript.trim().length > 0;
    if (result) {
      onResult(result, isFinal);
    }
  };

  recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
    // Silently ignore no-speech and aborted errors
    if (SILENT_ERRORS.has(event.error)) {
      console.log(`Speech recognition: ${event.error} (ignored)`);
      return;
    }
    const errorMessage = `Speech recognition error: ${event.error}`;
    console.error(errorMessage);
    onError(errorMessage);
  };

  recognition.onend = () => {
    console.log('Speech recognition ended');
    onEnd();
  };

  recognition.start();
  return recognition;
}

export function stopSpeechRecognition(recognition: SpeechRecognition | null) {
  if (recognition) {
    recognition.stop();
  }
}

export function speakText(
  text: string,
  language: Language,
  onComplete?: () => void,
  onError?: (error: string) => void
): SpeechSynthesisUtterance | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const synth = window.speechSynthesis;

  if (!synth) {
    onError?.('Speech synthesis is not supported on this browser');
    return null;
  }

  // Cancel any ongoing speech
  synth.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = LANGUAGE_CODES[language] || 'en-US';
  utterance.rate = 0.9;
  utterance.pitch = 1;
  utterance.volume = 1;

  utterance.onend = () => {
    onComplete?.();
  };

  utterance.onerror = (event: SpeechSynthesisErrorEvent) => {
    const errorMessage = `Speech synthesis error: ${event.error}`;
    console.error(errorMessage);
    onError?.(errorMessage);
  };

  synth.speak(utterance);
  return utterance;
}

export function stopSpeaking(): void {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}

export function isSpeechRecognitionSupported(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  return !!(
    window.SpeechRecognition ||
    window.webkitSpeechRecognition ||
    (window as any).mozSpeechRecognition ||
    (window as any).msSpeechRecognition
  );
}

export function isSpeechSynthesisSupported(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  return !!window.speechSynthesis;
}
