export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
};

export type VoiceState = 'idle' | 'listening' | 'processing' | 'speaking' | 'error';

export type Language =
  | 'en'
  | 'hi'
  | 'mr'
  | 'or'
  | 'bn'
  | 'ta'
  | 'te'
  | 'kn'
  | 'gu';

export const LANGUAGE_NAMES: Record<Language, string> = {
  en: 'English',
  hi: 'हिन्दी',
  mr: 'मराठी',
  or: 'ଓଡ଼ିଆ',
  bn: 'বাংলা',
  ta: 'தமிழ்',
  te: 'తెలుగు',
  kn: 'ಕನ್ನಡ',
  gu: 'ગુજરાતી',
};
