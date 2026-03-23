import { createHmac, timingSafeEqual } from 'crypto';
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
const rateLimitBuckets = new Map<string, RateLimitBucket>();

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
