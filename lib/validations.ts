import { sanitizeInput, validateContactNumber, validateEmail, validateFullName } from './validators';

export const VALID_CATEGORIES = [
  'Login Issue',
  'OTP Issue',
  'Payment Issue',
  'Order Issue',
  'App Bug',
  'Profile Issue',
  'Account Verification Issue',
  'Language/Translation Issue',
  'Technical Issue',
  'Other'
];

export const VALID_PRIORITIES = ['Low', 'Medium', 'High', 'Critical'];

export const VALID_STATUSES = ['Open', 'In Progress', 'Pending', 'Resolved', 'Closed', 'Archived'];

export interface TicketInput {
  userName: string;
  userMobile: string;
  userEmail?: string | null;
  category: string;
  title: string;
  description: string;
  priority?: string;
  language?: string | null;
  screenshotUrl?: string | null;
  chatTranscript?: any;
}

export function validateTicketInput(input: TicketInput): { isValid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  if (!input.userName || !validateFullName(input.userName)) {
    errors.userName = 'User name is required (between 2 and 100 characters).';
  }

  if (!input.userMobile || !validateContactNumber(input.userMobile)) {
    errors.userMobile = 'Mobile number is required and must be between 10 and 13 digits.';
  }

  if (input.userEmail && !validateEmail(input.userEmail)) {
    errors.userEmail = 'Please provide a valid email address.';
  }

  if (!input.category || !VALID_CATEGORIES.includes(input.category)) {
    errors.category = 'Invalid or missing issue category.';
  }

  if (!input.title || input.title.trim().length < 4 || input.title.length > 150) {
    errors.title = 'Issue title is required (between 4 and 150 characters).';
  }

  if (!input.description || input.description.trim().length < 10 || input.description.length > 3000) {
    errors.description = 'Issue description is required (between 10 and 3000 characters).';
  }

  if (input.priority && !VALID_PRIORITIES.includes(input.priority)) {
    errors.priority = 'Invalid priority level.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

export function sanitizeTicketInput(input: TicketInput): TicketInput {
  return {
    userName: sanitizeInput(input.userName || ''),
    userMobile: sanitizeInput(input.userMobile || ''),
    userEmail: input.userEmail ? sanitizeInput(input.userEmail) : null,
    category: input.category,
    title: sanitizeInput(input.title || ''),
    description: sanitizeInput(input.description || ''),
    priority: input.priority || 'Medium',
    language: input.language ? sanitizeInput(input.language) : 'en',
    screenshotUrl: input.screenshotUrl ? sanitizeInput(input.screenshotUrl) : null,
    chatTranscript: input.chatTranscript || null
  };
}
