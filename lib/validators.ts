import type { Language } from '@/types/chat';

export const VALID_LANGUAGES: Language[] = [
  'en',
  'hi',
  'mr',
  'or',
  'bn',
  'ta',
  'te',
  'kn',
  'gu',
];

export function isValidLanguage(language: string): language is Language {
  return VALID_LANGUAGES.includes(language as Language);
}

export function validateContactNumber(number: string): boolean {
  // Simple validation: at least 10 digits, at most 13 digits
  const digitsOnly = number.replace(/\D/g, '');
  return digitsOnly.length >= 10 && digitsOnly.length <= 13;
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

export function validateUserMessage(message: string): {
  valid: boolean;
  error?: string;
} {
  if (!message || message.trim().length === 0) {
    return { valid: false, error: 'Message cannot be empty' };
  }

  if (message.length > 1000) {
    return { valid: false, error: 'Message is too long (max 1000 characters)' };
  }

  return { valid: true };
}

export function validateFullName(name: string): boolean {
  if (!name || name.trim().length < 2) {
    return false;
  }
  return name.length <= 100;
}

export function validateDepartment(department: string): boolean {
  if (!department || department.trim().length < 1) {
    return false;
  }
  return department.length <= 100;
}

export function validateDesignation(designation: string): boolean {
  if (!designation || designation.trim().length < 1) {
    return false;
  }
  return designation.length <= 100;
}

export function validateIssueDescription(description: string): boolean {
  if (!description || description.trim().length < 10) {
    return false;
  }
  return description.length <= 2000;
}
