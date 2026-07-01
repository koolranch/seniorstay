import { createHmac, randomUUID, timingSafeEqual } from 'crypto';
import type { NextRequest } from 'next/server';

export type GuideAccessPurpose = 'pricing-guide' | 'care-guide';

interface GuideAccessTokenPayload {
  email: string;
  purpose: GuideAccessPurpose;
  issuedAt: number;
}

interface RateLimitBucket {
  count: number;
  resetAt: number;
}

const GUIDE_ACCESS_TOKEN_TTL_MS = 15 * 60 * 1000;
const LEAD_SUBMISSION_TOKEN_TTL_MS = 2 * 60 * 60 * 1000;
const LEAD_SUBMISSION_MIN_AGE_MS = 3_000;
const rateLimitBuckets = new Map<string, RateLimitBucket>();
const consumedSubmissionNonces = new Map<string, number>();

interface LeadSubmissionTokenPayload {
  nonce: string;
  issuedAt: number;
}

function getLeadSecuritySecret(): string {
  return (
    process.env.LEAD_SECURITY_SECRET ||
    process.env.WEBHOOK_SECRET ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.RESEND_API_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    'local-lead-security-secret'
  );
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function serializeGuidePayload(payload: GuideAccessTokenPayload): string {
  return `${payload.email}|${payload.purpose}|${payload.issuedAt}`;
}

function signGuidePayload(payload: GuideAccessTokenPayload): string {
  return createHmac('sha256', getLeadSecuritySecret())
    .update(serializeGuidePayload(payload))
    .digest('hex');
}

function hasValidSignature(actualSignature: string, expectedSignature: string): boolean {
  const actual = Buffer.from(actualSignature, 'utf8');
  const expected = Buffer.from(expectedSignature, 'utf8');

  if (actual.length !== expected.length) {
    return false;
  }

  return timingSafeEqual(actual, expected);
}

export function createGuideAccessToken(email: string, purpose: GuideAccessPurpose): string {
  const payload: GuideAccessTokenPayload = {
    email: normalizeEmail(email),
    purpose,
    issuedAt: Date.now(),
  };

  const encodedPayload = Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url');
  return `${encodedPayload}.${signGuidePayload(payload)}`;
}

export function verifyGuideAccessToken(
  token: string | undefined,
  email: string,
  purpose: GuideAccessPurpose,
): boolean {
  if (!token) {
    return false;
  }

  const [encodedPayload, signature] = token.split('.');
  if (!encodedPayload || !signature) {
    return false;
  }

  try {
    const payload = JSON.parse(
      Buffer.from(encodedPayload, 'base64url').toString('utf8'),
    ) as Partial<GuideAccessTokenPayload>;

    if (
      typeof payload.email !== 'string' ||
      typeof payload.purpose !== 'string' ||
      typeof payload.issuedAt !== 'number'
    ) {
      return false;
    }

    if (payload.email !== normalizeEmail(email) || payload.purpose !== purpose) {
      return false;
    }

    if (Date.now() - payload.issuedAt > GUIDE_ACCESS_TOKEN_TTL_MS) {
      return false;
    }

    if (payload.issuedAt > Date.now() + 60_000) {
      return false;
    }

    return hasValidSignature(signature, signGuidePayload(payload as GuideAccessTokenPayload));
  } catch {
    return false;
  }
}

export function consumeRateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();

  if (rateLimitBuckets.size > 5000) {
    for (const [bucketKey, bucket] of rateLimitBuckets.entries()) {
      if (bucket.resetAt <= now) {
        rateLimitBuckets.delete(bucketKey);
      }
    }
  }

  const existingBucket = rateLimitBuckets.get(key);
  if (!existingBucket || existingBucket.resetAt <= now) {
    rateLimitBuckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (existingBucket.count >= limit) {
    return false;
  }

  existingBucket.count += 1;
  rateLimitBuckets.set(key, existingBucket);
  return true;
}

export function getClientIp(request: NextRequest): string | null {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0]?.trim().slice(0, 45) || null;
  }

  const realIp = request.headers.get('x-real-ip');
  return realIp?.trim().slice(0, 45) || null;
}

function serializeLeadSubmissionPayload(payload: LeadSubmissionTokenPayload): string {
  return `${payload.nonce}|${payload.issuedAt}`;
}

function signLeadSubmissionPayload(payload: LeadSubmissionTokenPayload): string {
  return createHmac('sha256', getLeadSecuritySecret())
    .update(serializeLeadSubmissionPayload(payload))
    .digest('hex');
}

function pruneConsumedSubmissionNonces(now: number): void {
  if (consumedSubmissionNonces.size <= 5000) {
    return;
  }

  for (const [nonce, expiresAt] of consumedSubmissionNonces.entries()) {
    if (expiresAt <= now) {
      consumedSubmissionNonces.delete(nonce);
    }
  }
}

export function createLeadSubmissionToken(): string {
  const payload: LeadSubmissionTokenPayload = {
    nonce: randomUUID(),
    issuedAt: Date.now(),
  };

  const encodedPayload = Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url');
  return `${encodedPayload}.${signLeadSubmissionPayload(payload)}`;
}

export function verifyAndConsumeLeadSubmissionToken(token: string | undefined): {
  valid: boolean;
  issuedAt?: number;
  reason?: string;
} {
  if (!token) {
    return { valid: false, reason: 'missing_submission_token' };
  }

  const [encodedPayload, signature] = token.split('.');
  if (!encodedPayload || !signature) {
    return { valid: false, reason: 'malformed_submission_token' };
  }

  try {
    const payload = JSON.parse(
      Buffer.from(encodedPayload, 'base64url').toString('utf8'),
    ) as Partial<LeadSubmissionTokenPayload>;

    if (typeof payload.nonce !== 'string' || typeof payload.issuedAt !== 'number') {
      return { valid: false, reason: 'invalid_submission_token_payload' };
    }

    if (payload.issuedAt > Date.now() + 60_000) {
      return { valid: false, reason: 'submission_token_from_future' };
    }

    const age = Date.now() - payload.issuedAt;
    if (age > LEAD_SUBMISSION_TOKEN_TTL_MS) {
      return { valid: false, reason: 'submission_token_expired' };
    }

    if (age < LEAD_SUBMISSION_MIN_AGE_MS) {
      return { valid: false, reason: 'submission_token_too_fresh' };
    }

    if (
      !hasValidSignature(
        signature,
        signLeadSubmissionPayload(payload as LeadSubmissionTokenPayload),
      )
    ) {
      return { valid: false, reason: 'submission_token_bad_signature' };
    }

    const now = Date.now();
    pruneConsumedSubmissionNonces(now);

    if (consumedSubmissionNonces.has(payload.nonce)) {
      return { valid: false, reason: 'submission_token_reused' };
    }

    consumedSubmissionNonces.set(payload.nonce, now + LEAD_SUBMISSION_TOKEN_TTL_MS);
    return { valid: true, issuedAt: payload.issuedAt };
  } catch {
    return { valid: false, reason: 'submission_token_parse_error' };
  }
}
