/**
 * Server-side lead spam heuristics.
 * Targets bot patterns observed on /contact (Jun–Jul 2026).
 */

const SPAM_EMAIL_DOMAINS = new Set([
  '10minutemail.com',
  'dispostable.com',
  'fakeinbox.com',
  'guerrillamail.com',
  'jmailservice.com',
  'maildrop.cc',
  'mailinator.com',
  'sendproud.com',
  'sharklasers.com',
  'tempmail.com',
  'temp-mail.org',
  'throwawaymail.com',
  'yopmail.com',
]);

const OUTREACH_NOTE_PATTERNS = [
  /\bcalendly\.com\b/i,
  /\bguest post\b/i,
  /\bbacklink\b/i,
  /\bseo\b/i,
  /\bkeyword placement\b/i,
  /\boutreach\b/i,
  /\bfreelance writer\b/i,
  /\bfeatured on your site\b/i,
];

export type LeadSpamInput = {
  fullName?: string | null;
  email?: string | null;
  phone?: string | null;
  notes?: string | null;
};

export type LeadSpamVerdict = {
  isSpam: boolean;
  reason?: string;
};

function normalizeEmail(email: string | null | undefined): string | null {
  const value = email?.trim().toLowerCase();
  return value || null;
}

function digitsOnly(phone: string | null | undefined): string {
  return phone?.replace(/\D/g, '') || '';
}

function toTenDigitNanp(phone: string | null | undefined): string | null {
  const digits = digitsOnly(phone);
  if (digits.length === 11 && digits.startsWith('1')) {
    return digits.slice(1);
  }
  if (digits.length === 10) {
    return digits;
  }
  return null;
}

export function isValidNanpPhone(phone: string | null | undefined): boolean {
  const digits = toTenDigitNanp(phone);
  if (!digits) {
    return false;
  }

  const areaCode = digits.slice(0, 3);
  const exchange = digits.slice(3, 6);

  if (/^[01]/.test(areaCode) || /^[01]/.test(exchange)) {
    return false;
  }

  if (/(\d)\1{6,}/.test(digits)) {
    return false;
  }

  // 555 exchange is reserved/fictional in NANP; real subscribers never have it
  if (exchange === '555') {
    return false;
  }

  return true;
}

export function isDisposableOrSpamEmailDomain(email: string | null | undefined): boolean {
  const normalized = normalizeEmail(email);
  if (!normalized || !normalized.includes('@')) {
    return false;
  }

  const domain = normalized.split('@')[1];
  return domain ? SPAM_EMAIL_DOMAINS.has(domain) : false;
}

export function hasSuspiciousEmailDots(email: string | null | undefined): boolean {
  const normalized = normalizeEmail(email);
  if (!normalized || !normalized.includes('@')) {
    return false;
  }

  const localPart = normalized.split('@')[0] || '';
  const segments = localPart.split('.');

  if (segments.filter((segment) => segment.length === 1).length >= 3) {
    return true;
  }

  if (segments.length >= 4 && localPart.length >= 12) {
    return true;
  }

  return false;
}

export function looksLikeGibberishText(text: string | null | undefined): boolean {
  const trimmed = text?.trim();
  if (!trimmed || trimmed.length < 8) {
    return false;
  }

  const letters = trimmed.replace(/[^a-zA-Z]/g, '');
  if (letters.length < 8) {
    return false;
  }

  // Count capitals mid-word only (\B), skipping all-caps words so acronyms
  // ("ASAP", "AL") and normal names ("Mary Ann McDonald") don't trip the
  // bot detector, while random-case bot strings ("ddPPJqvSmScFTyaUqYl") do.
  const midWordCaps = trimmed
    .split(/\s+/)
    .filter((word) => !/^[^a-z]+$/.test(word))
    .reduce((count, word) => count + (word.match(/\B[A-Z]/g) || []).length, 0);
  if (midWordCaps >= 4 && letters.length >= 10) {
    return true;
  }

  const vowels = (letters.match(/[aeiouAEIOU]/g) || []).length;
  if (letters.length >= 12 && vowels / letters.length < 0.18) {
    return true;
  }

  const words = trimmed.split(/\s+/).filter(Boolean);
  if (words.length >= 2 && words.every((word) => word.length >= 10 && /[A-Z].*[A-Z]/.test(word.slice(1)))) {
    return true;
  }

  if (/^[A-Za-z]{16,}$/.test(trimmed) && midWordCaps >= 2) {
    return true;
  }

  return false;
}

function looksLikeOutreachNote(notes: string | null | undefined): boolean {
  const trimmed = notes?.trim();
  if (!trimmed || trimmed.length < 40) {
    return false;
  }

  return OUTREACH_NOTE_PATTERNS.some((pattern) => pattern.test(trimmed));
}

export function evaluateLeadSpamSignals(input: LeadSpamInput): LeadSpamVerdict {
  if (isDisposableOrSpamEmailDomain(input.email)) {
    return { isSpam: true, reason: 'spam_email_domain' };
  }

  if (hasSuspiciousEmailDots(input.email)) {
    return { isSpam: true, reason: 'suspicious_email_alias' };
  }

  if (input.phone && !isValidNanpPhone(input.phone)) {
    return { isSpam: true, reason: 'invalid_phone_number' };
  }

  if (looksLikeGibberishText(input.fullName)) {
    return { isSpam: true, reason: 'gibberish_name' };
  }

  if (looksLikeGibberishText(input.notes)) {
    return { isSpam: true, reason: 'gibberish_notes' };
  }

  if (looksLikeOutreachNote(input.notes)) {
    return { isSpam: true, reason: 'outreach_message' };
  }

  return { isSpam: false };
}

export { SPAM_EMAIL_DOMAINS };
