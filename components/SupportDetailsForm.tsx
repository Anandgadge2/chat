'use client';

import { useState, useEffect } from 'react';
import {
  validateFullName,
  validateContactNumber,
  validateDepartment,
  validateDesignation,
  validateIssueDescription,
} from '@/lib/validators';
import type { UserDetails } from '@/types/support';
import type { Language } from '@/types/chat';
import {
  FORM_LABELS,
  FORM_PLACEHOLDERS,
  PRIVACY_NOTE,
} from '@/lib/constants';

interface SupportDetailsFormProps {
  onSubmit: (details: UserDetails & { issueDescription: string }) => void;
  onCancel: () => void;
  isLoading?: boolean;
  selectedLanguage: Language;
}

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

export default function SupportDetailsForm({
  onSubmit,
  onCancel,
  isLoading = false,
  selectedLanguage,
}: SupportDetailsFormProps) {
  const [fullName, setFullName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [designation, setDesignation] = useState('');
  const [department, setDepartment] = useState('');
  const [issueDescription, setIssueDescription] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [labels, setLabels] = useState(FORM_LABELS);
  const [placeholders, setPlaceholders] = useState(FORM_PLACEHOLDERS);
  const [privacyNoteText, setPrivacyNoteText] = useState(PRIVACY_NOTE);
  const [submitBtnText, setSubmitBtnText] = useState('Submit');
  const [cancelBtnText, setCancelBtnText] = useState('Cancel');

  useEffect(() => {
    async function loadTranslations() {
      if (selectedLanguage === 'en') {
        setLabels(FORM_LABELS);
        setPlaceholders(FORM_PLACEHOLDERS);
        setPrivacyNoteText(PRIVACY_NOTE);
        setSubmitBtnText('Submit');
        setCancelBtnText('Cancel');
        return;
      }

      const newLabels = { ...FORM_LABELS };
      const newPlaceholders = { ...FORM_PLACEHOLDERS };

      await Promise.all([
        (async () => { newLabels.fullName = await translateText(FORM_LABELS.fullName, selectedLanguage); })(),
        (async () => { newLabels.contactNumber = await translateText(FORM_LABELS.contactNumber, selectedLanguage); })(),
        (async () => { newLabels.designation = await translateText(FORM_LABELS.designation, selectedLanguage); })(),
        (async () => { newLabels.department = await translateText(FORM_LABELS.department, selectedLanguage); })(),
        (async () => { newLabels.issueDescription = await translateText(FORM_LABELS.issueDescription, selectedLanguage); })(),

        (async () => { newPlaceholders.fullName = await translateText(FORM_PLACEHOLDERS.fullName, selectedLanguage); })(),
        (async () => { newPlaceholders.contactNumber = await translateText(FORM_PLACEHOLDERS.contactNumber, selectedLanguage); })(),
        (async () => { newPlaceholders.designation = await translateText(FORM_PLACEHOLDERS.designation, selectedLanguage); })(),
        (async () => { newPlaceholders.department = await translateText(FORM_PLACEHOLDERS.department, selectedLanguage); })(),
        (async () => { newPlaceholders.issueDescription = await translateText(FORM_PLACEHOLDERS.issueDescription, selectedLanguage); })(),

        (async () => { setPrivacyNoteText(await translateText(PRIVACY_NOTE, selectedLanguage)); })(),
        (async () => { setSubmitBtnText(await translateText('Submit', selectedLanguage)); })(),
        (async () => { setCancelBtnText(await translateText('Cancel', selectedLanguage)); })(),
      ]);

      setLabels(newLabels);
      setPlaceholders(newPlaceholders);
    }
    loadTranslations();
  }, [selectedLanguage]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!validateFullName(fullName)) {
      newErrors.fullName =
        'Full name must be at least 2 characters and at most 100 characters';
    }

    if (!validateContactNumber(contactNumber)) {
      newErrors.contactNumber =
        'Contact number must be between 10 and 13 digits';
    }

    if (!validateDesignation(designation)) {
      newErrors.designation = 'Designation is required and must be less than 100 characters';
    }

    if (!validateDepartment(department)) {
      newErrors.department = 'Department is required and must be less than 100 characters';
    }

    if (!validateIssueDescription(issueDescription)) {
      newErrors.issueDescription =
        'Issue description must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    onSubmit({
      fullName,
      contactNumber,
      designation,
      department,
      issueDescription,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3.5 mt-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-card max-w-sm mx-auto animate-[slideInUp_0.25s_cubic-bezier(0.1,0.8,0.3,1)]">
      {/* Privacy Note */}
      <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 text-[11px] text-[#0f766e] leading-normal flex items-start gap-2">
        <span className="text-sm mt-[-1px]">🔒</span>
        <span>{privacyNoteText}</span>
      </div>

      {/* Full Name */}
      <div>
        <label htmlFor="fullName" className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">
          {labels.fullName}
        </label>
        <input
          id="fullName"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder={placeholders.fullName}
          disabled={isLoading}
          className="w-full px-3.5 py-2.5 border border-slate-200 focus:border-[#0f766e] rounded-xl text-sm bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-emerald-100 transition-all disabled:bg-slate-100 disabled:opacity-60"
        />
        {errors.fullName && (
          <p className="mt-1 text-[10px] text-red-500 font-medium">{errors.fullName}</p>
        )}
      </div>

      {/* Contact Number */}
      <div>
        <label htmlFor="contactNumber" className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">
          {labels.contactNumber}
        </label>
        <input
          id="contactNumber"
          type="tel"
          value={contactNumber}
          onChange={(e) => setContactNumber(e.target.value)}
          placeholder={placeholders.contactNumber}
          disabled={isLoading}
          className="w-full px-3.5 py-2.5 border border-slate-200 focus:border-[#0f766e] rounded-xl text-sm bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-emerald-100 transition-all disabled:bg-slate-100 disabled:opacity-60"
        />
        {errors.contactNumber && (
          <p className="mt-1 text-[10px] text-red-500 font-medium">{errors.contactNumber}</p>
        )}
      </div>

      {/* Designation */}
      <div>
        <label htmlFor="designation" className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">
          {labels.designation}
        </label>
        <input
          id="designation"
          type="text"
          value={designation}
          onChange={(e) => setDesignation(e.target.value)}
          placeholder={placeholders.designation}
          disabled={isLoading}
          className="w-full px-3.5 py-2.5 border border-slate-200 focus:border-[#0f766e] rounded-xl text-sm bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-emerald-100 transition-all disabled:bg-slate-100 disabled:opacity-60"
        />
        {errors.designation && (
          <p className="mt-1 text-[10px] text-red-500 font-medium">{errors.designation}</p>
        )}
      </div>

      {/* Department */}
      <div>
        <label htmlFor="department" className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">
          {labels.department}
        </label>
        <input
          id="department"
          type="text"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          placeholder={placeholders.department}
          disabled={isLoading}
          className="w-full px-3.5 py-2.5 border border-slate-200 focus:border-[#0f766e] rounded-xl text-sm bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-emerald-100 transition-all disabled:bg-slate-100 disabled:opacity-60"
        />
        {errors.department && (
          <p className="mt-1 text-[10px] text-red-500 font-medium">{errors.department}</p>
        )}
      </div>

      {/* Issue Description */}
      <div>
        <label htmlFor="issueDescription" className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">
          {labels.issueDescription}
        </label>
        <textarea
          id="issueDescription"
          value={issueDescription}
          onChange={(e) => setIssueDescription(e.target.value)}
          placeholder={placeholders.issueDescription}
          disabled={isLoading}
          rows={3}
          className="w-full px-3.5 py-2.5 border border-slate-200 focus:border-[#0f766e] rounded-xl text-sm bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-emerald-100 transition-all disabled:bg-slate-100 disabled:opacity-60 resize-none"
        />
        {errors.issueDescription && (
          <p className="mt-1 text-[10px] text-red-500 font-medium">{errors.issueDescription}</p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-1">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 bg-[#0f766e] hover:bg-[#115e59] text-white font-semibold rounded-full shadow-soft transition-all hover:shadow-card active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
        >
          {isLoading ? '⏳' : '📤'}
          <span>{submitBtnText}</span>
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold rounded-full transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
        >
          <span>{cancelBtnText}</span>
        </button>
      </div>
    </form>
  );
}
