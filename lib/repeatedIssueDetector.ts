/**
 * Detects the repeated issue group based on keywords in the ticket title and description.
 * Rules:
 * - If description/title contains "OTP", "not received", "login", group under "OTP/Login Issue"
 * - If description/title contains "payment", "deducted", "failed", "refund", group under "Payment Issue"
 * - If description/title contains "app crash", "hang", "not opening", "crash", group under "App Bug"
 * - If description/title contains "order", "delivery", "not received", group under "Order Issue"
 * - If description/title contains "profile", "update", "edit", group under "Profile Issue"
 * - Otherwise group by the category itself.
 */
export function detectRepeatedGroup(title: string, description: string, category: string): string {
  const t = (title || '').toLowerCase();
  const d = (description || '').toLowerCase();

  // Rule 1: OTP/Login Issue
  if (
    t.includes('otp') || d.includes('otp') ||
    t.includes('not received') || d.includes('not received') ||
    t.includes('login') || d.includes('login')
  ) {
    return 'OTP/Login Issue';
  }

  // Rule 2: Payment Issue
  if (
    t.includes('payment') || d.includes('payment') ||
    t.includes('deducted') || d.includes('deducted') ||
    t.includes('failed') || d.includes('failed') ||
    t.includes('refund') || d.includes('refund')
  ) {
    return 'Payment Issue';
  }

  // Rule 3: App Bug
  if (
    t.includes('app crash') || d.includes('app crash') ||
    t.includes('hang') || d.includes('hang') ||
    t.includes('not opening') || d.includes('not opening') ||
    t.includes('crash') || d.includes('crash')
  ) {
    return 'App Bug';
  }

  // Rule 4: Order Issue
  if (
    t.includes('order') || d.includes('order') ||
    t.includes('delivery') || d.includes('delivery')
  ) {
    return 'Order Issue';
  }

  // Rule 5: Profile Issue
  if (
    t.includes('profile') || d.includes('profile') ||
    t.includes('update') || d.includes('update') ||
    t.includes('edit') || d.includes('edit')
  ) {
    return 'Profile Issue';
  }

  // Fallback: group by category
  return category || 'Other';
}

/**
 * Gets suggested actions based on the repeated group name.
 */
export function getSuggestedAction(group: string): string {
  switch (group) {
    case 'OTP/Login Issue':
      return 'Check SMS Gateway status, verify user credentials, check AWS SNS/Twilio logs.';
    case 'Payment Issue':
      return 'Verify gateway transaction status (Razorpay/Stripe), check webhook logs, initiate manual refund if status matches.';
    case 'App Bug':
      return 'Report to developer team with device model, Android/iOS version, and stack trace logs.';
    case 'Order Issue':
      return 'Contact third-party logistics API, check inventory syncing logs, coordinate with warehouse.';
    case 'Profile Issue':
      return 'Verify database update permissions, check S3 bucket permission (if profile photo upload issue), check verification API.';
    default:
      return 'Investigate ticket details, contact customer, and assign appropriate support engineer.';
  }
}
