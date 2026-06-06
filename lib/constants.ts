export const APP_NAME = 'PugArch FSM Support';
export const APP_DESCRIPTION = 'Get instant help for common app issues';

export const WELCOME_MESSAGE = `Hi! Welcome to ${APP_NAME}.
I can help you resolve issues instantly.
Please select the type of problem you are facing.`;

export const SOMETHING_ELSE_MESSAGE =
  'Describe your issue in as much detail as you can, and I will try to help you.';

export const LOW_CONFIDENCE_MESSAGE =
  'I found a few possible solutions. Which one matches your issue?';

export const NO_MATCH_MESSAGE =
  'I was not able to find a solution for this issue in our support database. Please share your details and our support team will contact you.';

export const ESCALATION_MESSAGE =
  'Sorry the solution did not work. Please share the following details so our support team can help you directly.';

export const HELPFUL_YES_MESSAGE = `Great! Glad I could help.
If you face any other issue, you can start again anytime.`;

export const HELPFUL_NO_MESSAGE =
  'Sorry the solution did not work. Please share the following details so our support team can help you directly.';

export const SUCCESS_MESSAGE =
  'Your issue has been shared with the support team. They will contact you shortly.';

export const VOICE_NOT_SUPPORTED_MESSAGE =
  'Voice input is not supported on this browser. Please type your issue.';

export const PRIVACY_NOTE =
  'Please do not share passwords, OTPs, Aadhaar, PAN, or payment details. Share only basic contact and issue information required for support.';

export const CONFIDENCE_THRESHOLDS = {
  HIGH: 0.75,
  MEDIUM: 0.5,
};

export const FORM_LABELS = {
  fullName: 'Full Name *',
  contactNumber: 'Contact Number *',
  designation: 'Organization Name *',
  department: 'Department *',
  issueDescription: 'Describe Your Issue *',
};

export const FORM_PLACEHOLDERS = {
  fullName: 'e.g., John Doe',
  contactNumber: 'e.g., 9876543210',
  designation: 'e.g., PugArch Pvt. Ltd.',
  department: 'e.g., Security',
  issueDescription: 'Please describe the issue you faced...',
};

export const SOLUTION_HEADER = 'Here is the solution:';
export const POSSIBLE_REASON_PREFIX = 'Possible Reason:';
export const STEPS_PREFIX = 'Steps to resolve:';

export const BUTTON_LABELS = {
  yes: 'Yes',
  no: 'No',
  submit: 'Submit',
  reset: 'Reset Chat',
  send: 'Send',
  speak: 'Speak',
  stop: 'Stop',
  selectCategory: 'Select Category',
  back: 'Back',
};
