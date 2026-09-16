import { evaluateLeadSpamSignals, isDisposableOrSpamEmailDomain } from '@/lib/lead-spam';

export const NURTURE_TIME_ZONE = 'America/New_York';
export const NURTURE_WINDOW_START_HOUR = 10;
export const NURTURE_WINDOW_END_HOUR = 17;
export const NURTURE_EMAIL1_DELAY_MS = 24 * 60 * 60 * 1000;
export const NURTURE_EMAIL2_DELAY_MS = 3 * 24 * 60 * 60 * 1000;
export const NURTURE_DEDUP_DAYS = 30;
export const PLACEMENT_PHONE_DISPLAY = '(216) 677-4630';

export const NURTURE_PAGE_TYPES = [
  'contact',
  'advisor_request',
  'assessment',
  'pricing_guide',
  'other',
] as const;

export const TERMINAL_LEAD_STATUSES = [
  'contacted',
  'qualified',
  'converted',
  'lost',
] as const;

export const ACTIVE_REFERRAL_STATUSES = [
  'new',
  'internal_review',
] as const;

export const PAST_REFERRAL_STATUSES = [
  'referral_sent',
  'tour_scheduled',
  'admitted',
  'paid',
] as const;

export type NurtureStep = 1 | 2;
export type NurtureRowStatus = 'scheduled' | 'sent' | 'cancelled' | 'skipped';

export type NurtureLeadSnapshot = {
  id: string;
  fullName?: string | null;
  email?: string | null;
  phone?: string | null;
  pageType?: string | null;
  careType?: string | null;
  status?: string | null;
  referral_status?: string | null;
  advisor_notes?: string | null;
  notes?: string | null;
};

export type NurtureSkipReason =
  | 'no_email'
  | 'spam'
  | 'disposable_email'
  | 'already_contacted'
  | 'already_spoke'
  | 'pipeline_advanced'
  | 'skilled_nursing'
  | 'ineligible_page'
  | 'tour_booked'
  | 'duplicate_sequence';

export type NurtureEligibility =
  | { ok: true; email: string; sequenceKey: string }
  | { ok: false; reason: NurtureSkipReason };

const WEEKDAY_INDEX: Record<string, number> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

const SPOKE_NOTE_PATTERN =
  /\b(spoke|called|talked|reached|connected|left (a )?voicemail|phone call|we talked|already (spoke|called|talked))\b/i;

function normalizeEmail(value: string | null | undefined): string | null {
  const email = value?.trim().toLowerCase();
  return email || null;
}

export function nurtureSequenceKey(email: string, phone?: string | null): string {
  const digits = phone?.replace(/\D/g, '') || '';
  const phoneKey = digits.length >= 10 ? digits.slice(-10) : '';
  return phoneKey ? `${email}|${phoneKey}` : email;
}

export function firstNameFromFullName(fullName?: string | null): string {
  const first = fullName?.trim().split(/\s+/)[0];
  return first || 'there';
}

export function isNurturePageType(pageType?: string | null): boolean {
  return NURTURE_PAGE_TYPES.includes((pageType || '') as (typeof NURTURE_PAGE_TYPES)[number]);
}

export function isTerminalLeadStatus(status?: string | null): boolean {
  return TERMINAL_LEAD_STATUSES.includes((status || '') as (typeof TERMINAL_LEAD_STATUSES)[number]);
}

export function isPastReferralStatus(referralStatus?: string | null): boolean {
  return PAST_REFERRAL_STATUSES.includes(
    (referralStatus || '') as (typeof PAST_REFERRAL_STATUSES)[number]
  );
}

export function isSkilledNursingCareType(careType?: string | null): boolean {
  const value = careType?.toLowerCase() || '';
  return value.includes('skilled') || value.includes('nursing home') || value === 'skilled nursing';
}

export function advisorNotesIndicateContact(notes?: string | null): boolean {
  return Boolean(notes && SPOKE_NOTE_PATTERN.test(notes));
}

export function isTourBooking(pageType?: string | null, notes?: string | null): boolean {
  if (pageType === 'tour_request') {
    return true;
  }
  return Boolean(notes && /^tour scheduled:/i.test(notes.trim()));
}

export function isBookedCallbackLead(pageType?: string | null, phone?: string | null): boolean {
  if (pageType === 'tour_request') {
    return true;
  }

  const digits = phone?.replace(/\D/g, '') || '';
  if (digits.length < 10) {
    return false;
  }

  return pageType === 'contact' || pageType === 'advisor_request' || pageType === 'other';
}

function zonedParts(date: Date, timeZone: string) {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone,
    weekday: 'short',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  });
  const parts = Object.fromEntries(formatter.formatToParts(date).map((part) => [part.type, part.value]));
  return {
    weekday: parts.weekday,
    year: Number(parts.year),
    month: Number(parts.month),
    day: Number(parts.day),
    hour: Number(parts.hour),
    minute: Number(parts.minute),
  };
}

function makeZonedDate(
  timeZone: string,
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number
): Date {
  const utcGuess = Date.UTC(year, month - 1, day, hour, minute, 0);
  const asIfUtc = new Date(utcGuess);
  const parts = zonedParts(asIfUtc, timeZone);
  const asIfLocalMs = Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, 0);
  return new Date(utcGuess - (asIfLocalMs - utcGuess));
}

function addCalendarDays(
  parts: ReturnType<typeof zonedParts>,
  days: number
): { year: number; month: number; day: number } {
  const utc = new Date(Date.UTC(parts.year, parts.month - 1, parts.day + days));
  return {
    year: utc.getUTCFullYear(),
    month: utc.getUTCMonth() + 1,
    day: utc.getUTCDate(),
  };
}

export function isWeekdaySendWindow(date: Date, timeZone = NURTURE_TIME_ZONE): boolean {
  const parts = zonedParts(date, timeZone);
  const weekday = WEEKDAY_INDEX[parts.weekday];
  if (weekday === undefined || weekday === 0 || weekday === 6) {
    return false;
  }
  return parts.hour >= NURTURE_WINDOW_START_HOUR && parts.hour < NURTURE_WINDOW_END_HOUR;
}

export function nextWeekdaySendAt(
  from: Date,
  minDelayMs: number,
  timeZone = NURTURE_TIME_ZONE
): Date {
  const candidate = new Date(from.getTime() + minDelayMs);
  const parts = zonedParts(candidate, timeZone);
  const weekday = WEEKDAY_INDEX[parts.weekday] ?? 0;

  const setTenAm = (year: number, month: number, day: number) =>
    makeZonedDate(timeZone, year, month, day, NURTURE_WINDOW_START_HOUR, 0);

  if (weekday === 6) {
    const monday = addCalendarDays(parts, 2);
    return setTenAm(monday.year, monday.month, monday.day);
  }

  if (weekday === 0) {
    const monday = addCalendarDays(parts, 1);
    return setTenAm(monday.year, monday.month, monday.day);
  }

  if (parts.hour >= NURTURE_WINDOW_END_HOUR) {
    const next = addCalendarDays(parts, weekday === 5 ? 3 : 1);
    return setTenAm(next.year, next.month, next.day);
  }

  if (parts.hour < NURTURE_WINDOW_START_HOUR) {
    return setTenAm(parts.year, parts.month, parts.day);
  }

  return candidate;
}

export function evaluateNurtureEligibility(lead: NurtureLeadSnapshot): NurtureEligibility {
  const email = normalizeEmail(lead.email);
  if (!email) {
    return { ok: false, reason: 'no_email' };
  }

  if (isTourBooking(lead.pageType, lead.notes)) {
    return { ok: false, reason: 'tour_booked' };
  }

  if (!isNurturePageType(lead.pageType)) {
    return { ok: false, reason: 'ineligible_page' };
  }

  if (isSkilledNursingCareType(lead.careType)) {
    return { ok: false, reason: 'skilled_nursing' };
  }

  if (isTerminalLeadStatus(lead.status)) {
    return { ok: false, reason: 'already_contacted' };
  }

  if (isPastReferralStatus(lead.referral_status)) {
    return { ok: false, reason: 'pipeline_advanced' };
  }

  if (advisorNotesIndicateContact(lead.advisor_notes)) {
    return { ok: false, reason: 'already_spoke' };
  }

  if (isDisposableOrSpamEmailDomain(email)) {
    return { ok: false, reason: 'disposable_email' };
  }

  const spam = evaluateLeadSpamSignals({
    fullName: lead.fullName,
    email,
    phone: lead.phone,
    notes: lead.advisor_notes,
  });
  if (spam.isSpam) {
    return { ok: false, reason: 'spam' };
  }

  return {
    ok: true,
    email,
    sequenceKey: nurtureSequenceKey(email, lead.phone),
  };
}

export function shouldCancelNurture(input: {
  status?: string | null;
  referralStatus?: string | null;
  advisorNotes?: string | null;
  pageType?: string | null;
  notes?: string | null;
}): boolean {
  return (
    isTerminalLeadStatus(input.status) ||
    isPastReferralStatus(input.referralStatus) ||
    advisorNotesIndicateContact(input.advisorNotes) ||
    isTourBooking(input.pageType, input.notes)
  );
}

export type NurtureEmailCopy = {
  subject: string;
  text: string;
  html: string;
};

export function buildNurtureEmail(step: NurtureStep, fullName?: string | null): NurtureEmailCopy {
  const firstName = firstNameFromFullName(fullName);

  switch (step) {
    case 1:
      return {
        subject: 'your note on senior living',
        text: [
          `Hi ${firstName},`,
          '',
          'I got your note. I help Cleveland families compare assisted living and memory care, and I answer the phone myself.',
          '',
          `If it is easier to talk, call me at ${PLACEMENT_PHONE_DISPLAY}.`,
          '',
          'Jocelynn',
          'Guide for Seniors',
        ].join('\n'),
        html: `
<p>Hi ${firstName},</p>
<p>I got your note. I help Cleveland families compare assisted living and memory care, and I answer the phone myself.</p>
<p>If it is easier to talk, call me at <a href="tel:+12166774630">${PLACEMENT_PHONE_DISPLAY}</a>.</p>
<p>Jocelynn<br>Guide for Seniors</p>
        `.trim(),
      };
    case 2:
      return {
        subject: 'one more note',
        text: [
          `Hi ${firstName},`,
          '',
          'Just circling back in case my first note got buried. I still answer the phone myself if you want to talk through assisted living or memory care around Cleveland.',
          '',
          `${PLACEMENT_PHONE_DISPLAY}`,
          '',
          'Jocelynn',
        ].join('\n'),
        html: `
<p>Hi ${firstName},</p>
<p>Just circling back in case my first note got buried. I still answer the phone myself if you want to talk through assisted living or memory care around Cleveland.</p>
<p><a href="tel:+12166774630">${PLACEMENT_PHONE_DISPLAY}</a></p>
<p>Jocelynn</p>
        `.trim(),
      };
    default: {
      const _exhaustive: never = step;
      throw new Error(`Unhandled nurture step: ${_exhaustive}`);
    }
  }
}

export type NurtureRowSummary = {
  leadId: string;
  step: NurtureStep;
  status: NurtureRowStatus;
  scheduledFor?: string | null;
  sentAt?: string | null;
  cancelReason?: string | null;
};

export function formatNurtureLabel(rows: NurtureRowSummary[]): string | null {
  if (!rows.length) {
    return null;
  }

  const sorted = [...rows].sort((a, b) => a.step - b.step);
  const latest = [...sorted].reverse()[0];
  const sentCount = sorted.filter((row) => row.status === 'sent').length;
  const scheduled = sorted.find((row) => row.status === 'scheduled');

  if (latest.status === 'cancelled') {
    return latest.cancelReason ? `Follow-up stopped (${latest.cancelReason})` : 'Follow-up stopped';
  }

  if (latest.status === 'skipped') {
    return 'Follow-up skipped';
  }

  if (sentCount >= 2) {
    return 'Both follow-ups sent';
  }

  if (scheduled) {
    const when = scheduled.scheduledFor
      ? new Date(scheduled.scheduledFor).toLocaleString('en-US', {
          timeZone: NURTURE_TIME_ZONE,
          weekday: 'short',
          hour: 'numeric',
          minute: '2-digit',
        })
      : 'soon';
    return sentCount === 1
      ? `Follow-up 2 scheduled ${when}`
      : `Follow-up 1 scheduled ${when}`;
  }

  if (sentCount === 1) {
    return 'Follow-up 1 sent';
  }

  return null;
}
