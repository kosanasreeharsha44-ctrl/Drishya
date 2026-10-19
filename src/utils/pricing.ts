import type { Currency, IdeaStatus, PaymentStatus, ProjectStatus } from '../types/index.ts';

// INR to USD baseline exchange rate
export const DEFAULT_INR_TO_USD_RATE = 0.012; // 1 INR ~ $0.012 (or $1 ~ 83.3 INR)

/**
 * Format currency amount cleanly with Indian numbering formatting for INR (e.g. ₹15,000) or USD ($180)
 */
export function formatCurrency(
  amountINR: number,
  currency: Currency = 'INR',
  exchangeRate: number = DEFAULT_INR_TO_USD_RATE
): string {
  if (isNaN(amountINR) || amountINR < 0) {
    return currency === 'INR' ? '₹0' : '$0';
  }

  if (currency === 'USD') {
    const amountUSD = Math.round(amountINR * exchangeRate);
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amountUSD);
  }

  // Format in Indian currency format (e.g. ₹1,50,000)
  const formattedNumber = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
  }).format(amountINR);
  return `₹${formattedNumber}`;
}

/**
 * Calculate checklist progress percentage and completion state
 */
export function calculateProjectProgress(tasks: { isDone: boolean }[]): {
  percent: number;
  isAllDone: boolean;
  completedCount: number;
  totalCount: number;
} {
  if (!tasks || tasks.length === 0) {
    return { percent: 0, isAllDone: false, completedCount: 0, totalCount: 0 };
  }

  const completedCount = tasks.filter((t) => t.isDone).length;
  const totalCount = tasks.length;
  const percent = Math.round((completedCount / totalCount) * 100);
  const isAllDone = completedCount === totalCount;

  return {
    percent,
    isAllDone,
    completedCount,
    totalCount,
  };
}

/**
 * Calculate Idea Revenue Share financials: amount owed, balance remaining, and recommended status
 */
export function calculateIdeaRevenue(
  amountEarned: number,
  sharePercent: number,
  amountPaid: number
): {
  amountOwed: number;
  balanceRemaining: number;
  suggestedStatus: IdeaStatus;
} {
  const safeEarned = Math.max(0, amountEarned || 0);
  const safePercent = Math.min(100, Math.max(0, sharePercent || 0));
  const safePaid = Math.max(0, amountPaid || 0);

  const amountOwed = Math.round((safeEarned * safePercent) / 100);
  const balanceRemaining = Math.max(0, amountOwed - safePaid);

  let suggestedStatus: IdeaStatus = 'New';
  if (safeEarned === 0 && safePaid === 0) {
    suggestedStatus = 'Accepted';
  } else if (safeEarned > 0 && balanceRemaining > 0) {
    suggestedStatus = 'Earning';
  } else if (safeEarned > 0 && balanceRemaining === 0) {
    suggestedStatus = 'Paid';
  }

  return {
    amountOwed,
    balanceRemaining,
    suggestedStatus,
  };
}

/**
 * Validate inquiry form submission
 */
export function validateInquiryForm(data: {
  name: string;
  email: string;
  service: string;
  details: string;
}): { isValid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  if (!data.name || data.name.trim().length < 2) {
    errors.name = 'Please provide your full name (at least 2 characters).';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email || !emailRegex.test(data.email.trim())) {
    errors.email = 'Please provide a valid email address.';
  }

  if (!data.service || data.service.trim().length === 0) {
    errors.service = 'Please select a service.';
  }

  if (!data.details || data.details.trim().length < 10) {
    errors.details = 'Please describe your project (at least 10 characters).';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Validate creative concept submission form
 */
export function validateConceptForm(data: {
  name: string;
  contact: string;
  title: string;
  description: string;
  consent: boolean;
}): { isValid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  if (!data.name || data.name.trim().length < 2) {
    errors.name = 'Please enter your name.';
  }

  if (!data.contact || data.contact.trim().length < 3) {
    errors.contact = 'Please provide your Email or Instagram handle.';
  }

  if (!data.title || data.title.trim().length < 4) {
    errors.title = 'Please give your concept a title (at least 4 characters).';
  }

  if (!data.description || data.description.trim().length < 20) {
    errors.description = 'Please outline your creative concept in detail (at least 20 characters).';
  }

  if (!data.consent) {
    errors.consent = 'You must agree to the revenue-share terms and original authorship agreement.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export const validateIdeaForm = validateConceptForm;

/**
 * Submission rate limiter utility
 */
export function checkRateLimit(
  lastSubmissionTimestamp: number | null,
  cooldownMs = 15000
): { allowed: boolean; remainingSeconds: number } {
  if (!lastSubmissionTimestamp) {
    return { allowed: true, remainingSeconds: 0 };
  }

  const elapsed = Date.now() - lastSubmissionTimestamp;
  if (elapsed < cooldownMs) {
    const remainingSeconds = Math.ceil((cooldownMs - elapsed) / 1000);
    return { allowed: false, remainingSeconds };
  }

  return { allowed: true, remainingSeconds: 0 };
}
