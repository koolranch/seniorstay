import { z } from 'zod';

// ============================================================================
// LEAD SCHEMA & TYPES (Separated from server action file)
// ============================================================================

/**
 * Zod validation schema for lead submissions
 * Made lenient to accept any string for enums, then normalize server-side
 */
export const LeadSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  phone: z.string()
    .regex(/^[\d\s\-\(\)\+]*$/, 'Invalid phone number format')
    .optional()
    .or(z.literal('')),
  cityOrZip: z.string().max(100).optional(),
  // Accept any string for careType - we'll normalize it server-side
  careType: z.string().max(100).optional().nullable(),
  // Accept any string for moveInTimeline - we'll normalize it server-side  
  moveInTimeline: z.string().max(100).optional().nullable(),
  notes: z.string().max(5000).optional(), // Increased for calculator JSON
  communityName: z.string().max(200).optional(),
  communityId: z.string().optional(),
  // Accept any string for pageType - we'll normalize it server-side
  pageType: z.string().max(100).optional().nullable(),
  sourceSlug: z.string().max(100).optional(), // Cleveland suburb slug
  // UTM tracking
  utmSource: z.string().max(100).optional(),
  utmMedium: z.string().max(100).optional(),
  utmCampaign: z.string().max(200).optional(),
});

/**
 * Inferred TypeScript type from Zod schema
 */
export type LeadInput = z.infer<typeof LeadSchema>;

/**
 * Structured response for frontend toast notifications
 */
export interface LeadSubmitResult {
  success: boolean;
  leadId?: string;
  urgencyScore?: number;
  priority?: 'high' | 'normal' | 'low';
  message: string;
  errors?: Record<string, string[]>;
}

/**
 * Referral pipeline status
 */
export type ReferralStatus = 'new' | 'internal_review' | 'referral_sent' | 'tour_scheduled' | 'admitted' | 'paid';
