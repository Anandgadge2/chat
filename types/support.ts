export type SupportIssue = {
  code: string;
  category: string;
  title: string;
  possibleReason: string;
  solutionSteps: string[];
  requiresUserDetails: boolean;
  escalationRequiredIfNotSolved: boolean;
  keywords: string[];
};

export type ChatMessage = {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  issueCode?: string;
  language?: string;
};

export type MatchIssueResponse = {
  matchedCode: string;
  confidence: number;
  detectedLanguage: string;
  needsEscalation: boolean;
  reason?: string;
};

export type TranslationResponse = {
  translatedText: string;
  provider: 'local' | 'libretranslate' | 'gemini' | 'fallback';
  language: string;
};

export type SupportTicket = {
  id: string;
  sessionId: string;
  fullName: string;
  contactNumber: string;
  designation: string;
  department: string;
  issueDescription: string;
  matchedIssueCode?: string;
  conversationHistory: ChatMessage[];
  status: 'open' | 'resolved' | 'escalated';
  createdAt: Date;
  updatedAt: Date;
};

export type UserDetails = {
  fullName: string;
  contactNumber: string;
  designation: string;
  department: string;
};

export type FeedbackEntry = {
  id: string;
  sessionId: string;
  issueCode: string;
  helpful: boolean;
  language: string;
  timestamp: Date;
};

export type ChatSession = {
  id: string;
  language: string;
  startedAt: Date;
  messages: ChatMessage[];
  status: 'active' | 'resolved' | 'escalated';
  matchedIssueCode?: string;
};
