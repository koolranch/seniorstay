import {
  evaluateLeadSpamSignals,
  looksLikeGibberishText,
} from '@/lib/lead-spam';

export const LEAD_QUALITIES = ['likely_family', 'review', 'likely_spam'] as const;

export type LeadQuality = (typeof LEAD_QUALITIES)[number];

export type LeadQualityInput = {
  fullName?: string | null;
  email?: string | null;
  phone?: string | null;
  notes?: string | null;
  pageType?: string | null;
  communityName?: string | null;
  cityOrZip?: string | null;
  sourceSlug?: string | null;
};

export type LeadQualityVerdict = {
  quality: LeadQuality;
  reason: string;
};

const OHIO_AREA_CODES = new Set([
  '216',
  '234',
  '330',
  '380',
  '419',
  '440',
  '513',
  '567',
  '614',
  '740',
  '937',
]);

const QA_EMAILS = new Set([
  'qatest.gfs@gmail.com',
]);

const CANNED_NOTE_PATTERNS = [
  /\bconsultation request from cleveland\b/i,
  /\bpricing guide request from cleveland\b/i,
  /\bplacement inquiry from\b/i,
  /\bcleveland senior care cost guide\b/i,
  /\brequested 20\d{2} .+ cost guide\b/i,
];

const FAMILY_NOTE_PATTERNS = [
  /\?/,
  /\bmom\b/i,
  /\bdad\b/i,
  /\bmother\b/i,
  /\bfather\b/i,
  /\bmedicaid\b/i,
  /\bsmoke\b/i,
  /\btour\b/i,
  /\bdementia\b/i,
  /\balzheimer/i,
  /\bmemory care\b/i,
  /\bassisted living\b/i,
  /\bneed help\b/i,
  /\blooking for\b/i,
];

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

function normalizeEmail(email: string | null | undefined): string | null {
  const value = email?.trim().toLowerCase();
  return value || null;
}

function hasVowel(word: string): boolean {
  return /[aeiouy]/i.test(word);
}

export function looksLikeHumanName(fullName: string | null | undefined): boolean {
  const trimmed = fullName?.trim();
  if (!trimmed || looksLikeGibberishText(trimmed)) {
    return false;
  }

  const words = trimmed.split(/\s+/).filter(Boolean);
  if (words.length < 2 || words.length > 4) {
    return false;
  }

  return words.every((word) => {
    const letters = word.replace(/[^A-Za-z]/g, '');
    if (letters.length < 2 || letters.length > 16) {
      return false;
    }
    if (!hasVowel(letters)) {
      return false;
    }
    if (!/^[A-Z][a-z]+(?:'[A-Za-z]+)?$/.test(word) && !/^Mc[A-Z][a-z]+$/.test(word)) {
      return false;
    }
    return true;
  });
}

function hasOhioPhone(phone: string | null | undefined): boolean {
  const digits = toTenDigitNanp(phone);
  return Boolean(digits && OHIO_AREA_CODES.has(digits.slice(0, 3)));
}

function isQaEmail(email: string | null | undefined): boolean {
  const normalized = normalizeEmail(email);
  return Boolean(normalized && (QA_EMAILS.has(normalized) || normalized.startsWith('qatest.')));
}

function isCannedFormNote(notes: string | null | undefined): boolean {
  const trimmed = notes?.trim();
  if (!trimmed) {
    return false;
  }
  return CANNED_NOTE_PATTERNS.some((pattern) => pattern.test(trimmed));
}

function looksLikeFamilyNotes(notes: string | null | undefined): boolean {
  const trimmed = notes?.trim();
  if (!trimmed || trimmed.length < 12 || isCannedFormNote(trimmed)) {
    return false;
  }
  return FAMILY_NOTE_PATTERNS.some((pattern) => pattern.test(trimmed));
}

function hasNamedCommunity(communityName: string | null | undefined): boolean {
  return Boolean(communityName?.trim() && communityName.trim().length >= 4);
}

export function classifyLeadQuality(input: LeadQualityInput): LeadQualityVerdict {
  const spam = evaluateLeadSpamSignals({
    fullName: input.fullName,
    email: input.email,
    phone: input.phone,
    notes: input.notes,
  });
  if (spam.isSpam) {
    return { quality: 'likely_spam', reason: spam.reason || 'spam_heuristics' };
  }

  if (isQaEmail(input.email) || /\bqa verification\b/i.test(input.notes || '')) {
    return { quality: 'likely_spam', reason: 'qa_test' };
  }

  if (isCannedFormNote(input.notes) && !looksLikeHumanName(input.fullName)) {
    return { quality: 'likely_spam', reason: 'canned_bot_note' };
  }

  if (!looksLikeHumanName(input.fullName)) {
    return { quality: 'likely_spam', reason: 'inhuman_name' };
  }

  if (hasOhioPhone(input.phone) || hasNamedCommunity(input.communityName) || looksLikeFamilyNotes(input.notes)) {
    return { quality: 'likely_family', reason: 'local_or_family_signal' };
  }

  return { quality: 'review', reason: 'human_name_no_local_signal' };
}

export function qualityRank(quality: LeadQuality): number {
  switch (quality) {
    case 'likely_family':
      return 0;
    case 'review':
      return 1;
    case 'likely_spam':
      return 2;
    default: {
      const exhaustive: never = quality;
      return exhaustive;
    }
  }
}

export function qualityLabel(quality: LeadQuality): string {
  switch (quality) {
    case 'likely_family':
      return 'Likely family';
    case 'review':
      return 'Needs review';
    case 'likely_spam':
      return 'Likely spam';
    default: {
      const exhaustive: never = quality;
      return exhaustive;
    }
  }
}
