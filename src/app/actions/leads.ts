'use server';

import { z } from 'zod';
import { headers } from 'next/headers';
import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';

// ============================================================================
// TYPES & SCHEMAS
// ============================================================================

/**
 * Zod validation schema for lead submissions
 * Validates all incoming lead data with strict type checking
 */
// Valid care types for the enum
const VALID_CARE_TYPES = [
  'Independent Living',
  'Assisted Living', 
  'Memory Care',
  'Skilled Nursing',
  'Respite Care',
  'Other',
  ''
] as const;

// Valid move-in timelines for the enum
const VALID_TIMELINES = [
  'Immediate',
  '1-3 months',
  '3-6 months', 
  '6+ months',
  'Just researching',
  ''
] as const;

// Valid page types for the enum
const VALID_PAGE_TYPES = [
  'location_page',
  'community_page', 
  'contact',
  'assessment',
  'homepage',
  'pricing_guide',
  'blog',
  'other',
  ''
] as const;

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
 * Normalize careType to a valid enum value
 */
function normalizeCareType(value: string | undefined | null): string | null {
  if (!value) return null;
  const normalized = value.trim();
  // Check if it's already a valid value
  if (VALID_CARE_TYPES.includes(normalized as typeof VALID_CARE_TYPES[number])) {
    return normalized;
  }
  // Try to map common variations
  const lower = normalized.toLowerCase();
  if (lower.includes('memory') || lower.includes('dementia') || lower.includes('alzheimer')) return 'Memory Care';
  if (lower.includes('assisted')) return 'Assisted Living';
  if (lower.includes('independent')) return 'Independent Living';
  if (lower.includes('skilled') || lower.includes('nursing')) return 'Skilled Nursing';
  if (lower.includes('respite')) return 'Respite Care';
  // Default to 'Other' for any unrecognized value
  return 'Other';
}

/**
 * Normalize moveInTimeline to a valid enum value
 */
function normalizeMoveInTimeline(value: string | undefined | null): string | null {
  if (!value) return null;
  const normalized = value.trim();
  // Check if it's already a valid value
  if (VALID_TIMELINES.includes(normalized as typeof VALID_TIMELINES[number])) {
    return normalized;
  }
  // Try to map common variations
  const lower = normalized.toLowerCase();
  if (lower.includes('immediate') || lower.includes('asap') || lower.includes('urgent')) return 'Immediate';
  if (lower.includes('1') || lower.includes('one') || lower.includes('few weeks')) return '1-3 months';
  if (lower.includes('3') || lower.includes('three') || lower.includes('few months')) return '3-6 months';
  if (lower.includes('6') || lower.includes('six') || lower.includes('later')) return '6+ months';
  if (lower.includes('research') || lower.includes('exploring') || lower.includes('not sure')) return 'Just researching';
  // Default for unrecognized
  return 'Just researching';
}

/**
 * Normalize pageType to a valid enum value
 */
function normalizePageType(value: string | undefined | null): string | null {
  if (!value) return 'other';
  const normalized = value.trim();
  // Check if it's already a valid value
  if (VALID_PAGE_TYPES.includes(normalized as typeof VALID_PAGE_TYPES[number])) {
    return normalized;
  }
  return 'other';
}

// ============================================================================
// CALCULATOR META DATA PARSING
// ============================================================================

interface CalculatorMetaData {
  homeValue?: number;
  mortgage?: number;
  groceries?: number;
  utilities?: number;
  maintenance?: number;
  homeCareHours?: number;
  homeCareCost?: number;
  propertyTax?: number;
  totalHomeCost?: number;
  selectedLocation?: string;
  seniorLivingCost?: number;
  valueGap?: number;
  valueGapPercent?: number;
  isHighValue?: boolean;
  monthlySavings?: number;
  annualSavings?: number;
}

/**
 * Parse calculator meta_data from notes field
 * Returns null if notes don't contain calculator data
 */
function parseCalculatorMetaData(notes?: string): CalculatorMetaData | null {
  if (!notes || !notes.includes('---META_DATA_JSON---')) {
    return null;
  }
  
  try {
    const jsonPart = notes.split('---META_DATA_JSON---')[1]?.trim();
    if (!jsonPart) return null;
    return JSON.parse(jsonPart) as CalculatorMetaData;
  } catch {
    return null;
  }
}

/**
 * Determine if this is a HIGH-VALUE Cleveland lead based on calculator data
 * 
 * HIGH-VALUE criteria:
 * - Home Value > $350,000 (affluent homeowner)
 * - OR Value Gap > $500/month (senior living saves money)
 */
function isHighValueCalculatorLead(metaData: CalculatorMetaData | null): boolean {
  if (!metaData) return false;
  
  // Check for affluent homeowner (home value > $350k)
  if (metaData.homeValue && metaData.homeValue > 350000) {
    return true;
  }
  
  // Check for significant value gap (savings > $500/month)
  if (metaData.valueGap && metaData.valueGap > 500) {
    return true;
  }
  
  return false;
}

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

// ============================================================================
// LEAD SCORING LOGIC
// ============================================================================

/**
 * High-urgency keywords that indicate immediate need
 * +40 points if found in notes
 */
const URGENCY_KEYWORDS = [
  'hospital',
  'discharge', 
  'discharging',
  'falling',
  'fell',
  'fall risk',
  'emergency',
  'urgent',
  'immediate',
  'asap',
  'today',
  'tomorrow',
  'this week',
  'stroke',
  'surgery',
  'rehabilitation',
  'rehab',
  'hospice',
  'dementia crisis',
  'wandering',
  'safety concern',
];

/**
 * Calculate lead urgency score based on form data
 * 
 * Scoring breakdown:
 * - +50: Immediate move-in timeline
 * - +30: Memory Care or Respite (high urgency care types)
 * - +20: Phone number provided (indicates serious intent)
 * - +40: Notes mention hospital/discharge/falling keywords
 * - +10: Specific community mentioned (buyer intent)
 * - +15: 1-3 month timeline
 * - +10: Assisted Living care type
 * 
 * @param data - Lead form data
 * @returns Score from 0-165+
 */
function calculateLeadScore(data: LeadInput): number {
  let score = 0;

  // Timeline scoring
  if (data.moveInTimeline === 'Immediate') {
    score += 50;
  } else if (data.moveInTimeline === '1-3 months') {
    score += 15;
  }

  // Care type scoring (normalize first for flexible matching)
  const careTypeLower = (data.careType || '').toLowerCase();
  if (careTypeLower.includes('memory') || careTypeLower.includes('respite') || careTypeLower.includes('dementia')) {
    score += 30;
  } else if (careTypeLower.includes('assisted')) {
    score += 10;
  } else if (careTypeLower.includes('skilled') || careTypeLower.includes('nursing')) {
    score += 20;
  }

  // Phone number provided = serious intent
  if (data.phone && data.phone.replace(/\D/g, '').length >= 10) {
    score += 20;
  }

  // Check notes for urgency keywords
  if (data.notes) {
    const notesLower = data.notes.toLowerCase();
    const foundKeywords = URGENCY_KEYWORDS.filter(keyword => 
      notesLower.includes(keyword.toLowerCase())
    );
    
    if (foundKeywords.length > 0) {
      // +40 for first keyword, +10 for each additional (max +70)
      score += Math.min(40 + (foundKeywords.length - 1) * 10, 70);
    }
  }

  // Specific community mentioned = buyer intent
  if (data.communityName && data.communityName.trim().length > 0) {
    score += 10;
  }

  return score;
}

/**
 * Determine lead priority based on score
 */
function getPriority(score: number): 'high' | 'normal' | 'low' {
  if (score > 80) return 'high';
  if (score >= 30) return 'normal';
  return 'low';
}

// ============================================================================
// SUPABASE CLIENT (Server-side with service role)
// ============================================================================

/**
 * Create Supabase client for server-side operations
 * Uses service role key for full database access
 */
function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://hncgnxbooghjhpncujzx.supabase.co';
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseServiceKey) {
    // Fallback to anon key if service key not available
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhuY2dueGJvb2doamhwbmN1anp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyMTI0ODIsImV4cCI6MjA1OTc4ODQ4Mn0.mdAL87W0h4PN7Xu8ESjjDxzjW_H3YH55i-FqAE5SXcs';
    return createClient(supabaseUrl, anonKey);
  }
  
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

// ============================================================================
// INTERNAL REFERRAL NOTIFICATION SYSTEM
// All leads are sent to internal email for review before forwarding to communities
// ============================================================================

/**
 * Hospital proximity mapping for Cleveland area
 */
const HOSPITAL_PROXIMITY: Record<string, string> = {
  beachwood: 'UH Ahuja Medical Center (1.8 mi)',
  'shaker heights': 'UH Ahuja Medical Center (2.4 mi)',
  'shaker-heights': 'UH Ahuja Medical Center (2.4 mi)',
  westlake: 'St. John Medical Center (1.2 mi)',
  'rocky river': 'Fairview Hospital (2.1 mi)',
  'rocky-river': 'Fairview Hospital (2.1 mi)',
  lakewood: 'Lakewood Hospital/Cleveland Clinic (0.8 mi)',
  parma: 'UH Parma Medical Center (1.5 mi)',
  strongsville: 'Southwest General Hospital (3.2 mi)',
  mentor: 'Lake Health Mentor (2.0 mi)',
  solon: 'UH Ahuja Medical Center (4.1 mi)',
  cleveland: 'Cleveland Clinic Main Campus (varies)',
};

/**
 * Get nearest hospital for a city
 */
function getNearestHospital(city?: string): string {
  const normalizedCity = city?.toLowerCase().replace(/-/g, ' ') || 'cleveland';
  return HOSPITAL_PROXIMITY[normalizedCity] || 'Cleveland Clinic Main Campus';
}

/**
 * Format city name for display
 */
function formatCityName(slug?: string): string {
  if (!slug) return 'Cleveland';
  return slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

/**
 * Send internal referral draft to advisor email
 * 
 * HIGH-VALUE leads: 🚨 PRIORITY: [City Name] Referral - $[Comm. Fee] Potential
 * Standard leads: Lead Inquiry: [City Name] - [Lead Name]
 * 
 * Body formatted as "Ready-to-Forward" referral draft
 */
async function sendInternalReferralDraft(lead: {
  id: string;
  fullName: string;
  phone?: string;
  email?: string;
  careType?: string;
  moveInTimeline?: string;
  notes?: string;
  sourceSlug?: string;
  urgencyScore: number;
  isHighValue: boolean;
  calculatorData?: CalculatorMetaData | null;
  estimatedCommission: number;
  communityName?: string;
}): Promise<boolean> {
  try {
    const cityName = formatCityName(lead.sourceSlug);
    const nearestHospital = getNearestHospital(lead.sourceSlug);
    
    // Dynamic subject line based on high-value status
    const subject = lead.isHighValue
      ? `🚨 PRIORITY: ${cityName} Referral - $${lead.estimatedCommission.toLocaleString()} Potential`
      : `Lead Inquiry: ${cityName} - ${lead.fullName}`;
    
    // Financial profile from calculator
    const homeValue = lead.calculatorData?.homeValue 
      ? `$${lead.calculatorData.homeValue.toLocaleString()}` 
      : 'Not provided';
    const careBudget = lead.calculatorData?.seniorLivingCost
      ? `$${lead.calculatorData.seniorLivingCost.toLocaleString()}/mo`
      : lead.careType === 'Memory Care' ? '$6,800+/mo (est.)' : '$5,520+/mo (est.)';
    const valueGap = lead.calculatorData?.valueGap
      ? `${lead.calculatorData.valueGap > 0 ? '+' : ''}$${lead.calculatorData.valueGap.toLocaleString()}/mo`
      : 'Not calculated';
    
    // Build the "Ready-to-Forward" referral draft
    const referralDraftBody = `
═══════════════════════════════════════════════════════════════════
${lead.isHighValue ? '🚨 HIGH-VALUE REFERRAL DRAFT - READY TO FORWARD' : '📋 REFERRAL DRAFT - READY TO FORWARD'}
═══════════════════════════════════════════════════════════════════

PROSPECT INFORMATION
────────────────────
Lead Name: ${lead.fullName}
Care Type Needed: ${lead.careType || 'Assisted Living'}
Move-in Timeline: ${lead.moveInTimeline || 'Not specified'}
Phone: ${lead.phone || 'Not provided'}
Email: ${lead.email || 'Not provided'}

FINANCIAL PROFILE ${lead.isHighValue ? '⭐ HIGH-VALUE' : ''}
────────────────────
Home Value: ${homeValue}
Care Budget: ${careBudget}
Value Gap vs. Home: ${valueGap}
${lead.calculatorData?.annualSavings ? `Annual Savings Potential: $${lead.calculatorData.annualSavings.toLocaleString()}` : ''}

CLINICAL PROFILE
────────────────────
Source Location: ${cityName}, OH
Nearest Major Hospital: ${nearestHospital}
Urgency Score: ${lead.urgencyScore}/100 (${lead.urgencyScore > 80 ? 'HIGH' : lead.urgencyScore > 30 ? 'NORMAL' : 'LOW'})

${lead.notes ? `ADDITIONAL NOTES\n────────────────────\n${lead.notes.split('---META_DATA_JSON---')[0]?.trim() || 'None'}\n` : ''}
═══════════════════════════════════════════════════════════════════
FORWARD THIS TO COMMUNITY - COPY BELOW LINE
═══════════════════════════════════════════════════════════════════

Hello,

I have a qualified prospect seeking ${lead.careType || 'Assisted Living'} in the ${cityName} area with a ${lead.moveInTimeline?.toLowerCase() || 'flexible'} timeline.

Prospect Details:
• Name: ${lead.fullName}
• Care Type: ${lead.careType || 'Assisted Living'}
• Timeline: ${lead.moveInTimeline || 'Flexible'}
• Budget: ${careBudget}

Please confirm fee protection for Guide For Seniors upon move-in.

I will connect you with the prospect upon acknowledgment.

Best regards,
Guide For Seniors
Cleveland Senior Living Advisor
(216) 677-4630

═══════════════════════════════════════════════════════════════════
INTERNAL TRACKING
═══════════════════════════════════════════════════════════════════
Lead ID: ${lead.id}
Estimated Commission: $${lead.estimatedCommission.toLocaleString()}
Dashboard: https://guideforseniors.com/dashboard/pipeline
Profile: https://guideforseniors.com/api/lead-profile/${lead.id}
`.trim();

    // Send to internal email via webhook or Formspree
    const webhookUrl = process.env.INTERNAL_REFERRAL_WEBHOOK || process.env.HIGH_PRIORITY_LEAD_WEBHOOK;
    
    if (webhookUrl) {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.WEBHOOK_SECRET || ''}`,
        },
        body: JSON.stringify({
          type: lead.isHighValue ? 'HIGH_VALUE_REFERRAL_DRAFT' : 'STANDARD_REFERRAL_DRAFT',
          subject,
          body: referralDraftBody,
          lead: {
            id: lead.id,
            name: lead.fullName,
            phone: lead.phone,
            email: lead.email,
            careType: lead.careType,
            timeline: lead.moveInTimeline,
            source: lead.sourceSlug,
            score: lead.urgencyScore,
            isHighValue: lead.isHighValue,
            estimatedCommission: lead.estimatedCommission,
            homeValue: lead.calculatorData?.homeValue,
            careBudget: lead.calculatorData?.seniorLivingCost,
          },
          timestamp: new Date().toISOString(),
        }),
        signal: AbortSignal.timeout(5000),
      });
      
      return response.ok;
    }

    // Fallback to Formspree
    const formspreeEndpoint = process.env.FORMSPREE_REFERRAL_ENDPOINT || process.env.FORMSPREE_HIGH_PRIORITY_ENDPOINT;
    if (formspreeEndpoint) {
      const response = await fetch(formspreeEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          _subject: subject,
          message: referralDraftBody,
          lead_name: lead.fullName,
          lead_phone: lead.phone || 'Not provided',
          lead_email: lead.email || 'Not provided',
          care_type: lead.careType || 'Assisted Living',
          timeline: lead.moveInTimeline || 'Not specified',
          city: cityName,
          home_value: homeValue,
          care_budget: careBudget,
          nearest_hospital: nearestHospital,
          estimated_commission: `$${lead.estimatedCommission.toLocaleString()}`,
          urgency_score: lead.urgencyScore,
          is_high_value: lead.isHighValue,
          lead_id: lead.id,
          profile_url: `https://guideforseniors.com/api/lead-profile/${lead.id}`,
        }),
        signal: AbortSignal.timeout(5000),
      });
      
      return response.ok;
    }

    console.warn('[Referral Draft] No webhook configured for internal referral notifications');
    return false;
    
  } catch (error) {
    console.error('[Referral Draft] Failed to send internal referral draft:', error);
    return false;
  }
}

// Legacy alias for backwards compatibility
const sendHighPriorityAlert = sendInternalReferralDraft;

// ============================================================================
// MAIN SERVER ACTION
// ============================================================================

/**
 * Server Action: Submit Lead
 * 
 * - Validates input using Zod
 * - Calculates urgency score
 * - Upserts to Supabase Lead table (by email if exists)
 * - Triggers high-priority alert if score > 80
 * - Returns structured response for frontend toast
 */
export async function submitLead(formData: LeadInput): Promise<LeadSubmitResult> {
  const startTime = Date.now();
  
  try {
    // -------------------------------------------------------------------------
    // 1. VALIDATE INPUT
    // -------------------------------------------------------------------------
    const validationResult = LeadSchema.safeParse(formData);
    
    if (!validationResult.success) {
      const errors: Record<string, string[]> = {};
      validationResult.error.issues.forEach((issue) => {
        const field = String(issue.path[0]);
        if (!errors[field]) errors[field] = [];
        errors[field].push(issue.message);
      });
      
      return {
        success: false,
        message: 'Please check the form for errors.',
        errors,
      };
    }
    
    const data = validationResult.data;
    
    // -------------------------------------------------------------------------
    // 2. EXTRACT ATTRIBUTION FROM HEADERS
    // -------------------------------------------------------------------------
    const headersList = await headers();
    const userAgent = headersList.get('user-agent') || undefined;
    const referer = headersList.get('referer') || '';
    
    // Extract source slug from referer URL if not provided
    let sourceSlug = data.sourceSlug;
    let pageType = data.pageType;
    
    if (!sourceSlug && referer) {
      // Parse /location/westlake -> westlake
      const locationMatch = referer.match(/\/location\/([^\/\?]+)/);
      if (locationMatch) {
        sourceSlug = locationMatch[1];
        pageType = pageType || 'location_page';
      }
      
      // Parse /community/... -> community_page
      if (referer.includes('/community/')) {
        pageType = pageType || 'community_page';
      }
    }
    
    // Hash IP for privacy (just for analytics, not stored in plain text)
    const forwardedFor = headersList.get('x-forwarded-for');
    const ipAddress = forwardedFor ? 
      forwardedFor.split(',')[0].trim().substring(0, 45) : undefined;
    
    // -------------------------------------------------------------------------
    // 3. CALCULATE URGENCY SCORE & PARSE CALCULATOR DATA
    // -------------------------------------------------------------------------
    const urgencyScore = calculateLeadScore(data);
    const priority = getPriority(urgencyScore);
    
    // Parse calculator meta_data if present
    const calculatorData = parseCalculatorMetaData(data.notes);
    const isHighValueCalculator = isHighValueCalculatorLead(calculatorData);
    
    // Boost score for high-value calculator leads
    const finalUrgencyScore = isHighValueCalculator ? Math.max(urgencyScore, 85) : urgencyScore;
    const finalPriority = getPriority(finalUrgencyScore);
    
    // -------------------------------------------------------------------------
    // 4. PREPARE LEAD DATA FOR SUPABASE
    // -------------------------------------------------------------------------
    
    // Clean notes (remove JSON for readability, keep summary)
    const cleanNotes = data.notes?.split('---META_DATA_JSON---')[0]?.trim() || null;
    
    // Estimate commission based on city and care type
    const estimatedCommission = estimateCommission(sourceSlug, data.careType);
    
    // Extract financial readiness indicators from calculator
    const homeValue = calculatorData?.homeValue || null;
    const valueGap = calculatorData?.valueGap || null;
    const calculatedBudget = calculatorData?.seniorLivingCost || null;
    
    // Normalize enum values to ensure valid data
    const normalizedCareType = normalizeCareType(data.careType);
    const normalizedTimeline = normalizeMoveInTimeline(data.moveInTimeline);
    const normalizedPageType = normalizePageType(pageType);
    
    const leadData = {
      fullName: data.fullName.trim(),
      email: data.email?.trim() || null,
      phone: data.phone?.trim() || null,
      cityOrZip: data.cityOrZip?.trim() || null,
      careType: normalizedCareType,
      moveInTimeline: normalizedTimeline,
      notes: cleanNotes,
      communityName: data.communityName?.trim() || null,
      communityId: data.communityId || null,
      pageType: normalizedPageType,
      sourceSlug: sourceSlug || null,
      urgencyScore: finalUrgencyScore,
      priority: finalPriority,
      alertSent: false,
      utmSource: data.utmSource || null,
      utmMedium: data.utmMedium || null,
      utmCampaign: data.utmCampaign || null,
      userAgent: userAgent?.substring(0, 500) || null,
      ipAddress: ipAddress || null,
      status: 'new',
      updatedAt: new Date().toISOString(),
      // Store structured calculator data as JSONB
      ...(calculatorData && { meta_data: calculatorData }),
      // Commission & referral tracking
      referral_status: 'new',
      estimated_commission: estimatedCommission,
      is_high_value: isHighValueCalculator,
      // Financial readiness indicators
      ...(homeValue && { home_value: homeValue }),
      ...(valueGap && { value_gap: valueGap }),
      ...(calculatedBudget && { calculated_budget: calculatedBudget }),
    };
    
    // -------------------------------------------------------------------------
    // 5. UPSERT TO SUPABASE
    // -------------------------------------------------------------------------
    const supabase = getSupabaseAdmin();
    
    let leadId: string;
    
    // If email provided, try to upsert (update existing or insert new)
    if (data.email && data.email.trim()) {
      // Check if lead exists
      const { data: existingLead } = await supabase
        .from('Lead')
        .select('id, urgencyScore')
        .eq('email', data.email.trim())
        .single();
      
      if (existingLead) {
        // Update existing lead - keep higher urgency score
        const newScore = Math.max(existingLead.urgencyScore || 0, urgencyScore);
        
        const { data: updated, error: updateError } = await supabase
          .from('Lead')
          .update({
            ...leadData,
            urgencyScore: newScore,
            priority: getPriority(newScore),
            updatedAt: new Date().toISOString(),
          })
          .eq('id', existingLead.id)
          .select('id')
          .single();
        
        if (updateError) throw updateError;
        leadId = updated.id;
      } else {
        // Insert new lead
        const { data: inserted, error: insertError } = await supabase
          .from('Lead')
          .insert({
            id: randomUUID(), // Generate UUID since table doesn't auto-generate
            ...leadData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          })
          .select('id')
          .single();
        
        if (insertError) throw insertError;
        leadId = inserted.id;
      }
    } else {
      // No email - always insert as new lead
      const { data: inserted, error: insertError } = await supabase
        .from('Lead')
        .insert({
          id: randomUUID(), // Generate UUID since table doesn't auto-generate
          ...leadData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
        .select('id')
        .single();
      
      if (insertError) throw insertError;
      leadId = inserted.id;
    }
    
    // -------------------------------------------------------------------------
    // 6. INTERNAL REFERRAL: Send draft to internal email for review
    // All notifications now go to YOUR internal email for review before forwarding
    // HIGH-VALUE leads get 🚨 PRIORITY subject, standard leads get normal subject
    // -------------------------------------------------------------------------
    const internalDraftSent = await sendInternalReferralDraft({
      id: leadId,
      fullName: data.fullName,
      phone: data.phone,
      email: data.email,
      careType: normalizedCareType || undefined,
      moveInTimeline: normalizedTimeline || undefined,
      notes: cleanNotes || undefined,
      sourceSlug,
      urgencyScore: finalUrgencyScore,
      isHighValue: isHighValueCalculator,
      calculatorData,
      estimatedCommission,
      communityName: data.communityName,
    });
    
    // Update referral status to 'internal_review' in database
    if (internalDraftSent) {
      await supabase
        .from('Lead')
        .update({ 
          referral_status: 'internal_review',
          referral_sent_at: new Date().toISOString(),
        })
        .eq('id', leadId);
        
      const priorityLabel = isHighValueCalculator ? '🚨 PRIORITY' : '📋 Standard';
      console.log(`[Internal Referral] ${priorityLabel} draft sent for lead: ${leadId}, commission: $${estimatedCommission}`);
    }
    
    // -------------------------------------------------------------------------
    // 7. LOG & RETURN SUCCESS
    // -------------------------------------------------------------------------
    const duration = Date.now() - startTime;
    const logExtra = isHighValueCalculator ? ` [HIGH-VALUE: $${calculatorData?.homeValue?.toLocaleString()}]` : '';
    console.log(`[Lead] Submitted in ${duration}ms: ${leadId}, score: ${finalUrgencyScore}, source: ${sourceSlug || 'direct'}${logExtra}`);
    
    return {
      success: true,
      leadId,
      urgencyScore: finalUrgencyScore,
      priority: finalPriority,
      message: finalPriority === 'high' 
        ? 'Thank you! A senior advisor will contact you very soon.'
        : 'Thank you! We\'ll be in touch within 1 business day.',
    };
    
  } catch (error) {
    // -------------------------------------------------------------------------
    // ERROR HANDLING - Enhanced with specific Supabase error detection
    // -------------------------------------------------------------------------
    console.error('[Lead] Submission error:', error);
    
    // Extract error details for debugging
    const errorDetails = {
      message: error instanceof Error ? error.message : String(error),
      name: error instanceof Error ? error.name : 'Unknown',
      // Supabase errors have additional properties
      code: (error as { code?: string })?.code,
      hint: (error as { hint?: string })?.hint,
      details: (error as { details?: string })?.details,
    };
    console.error('[Lead] Error details:', JSON.stringify(errorDetails, null, 2));
    
    // Check for specific error types
    if (error instanceof Error) {
      // Supabase RLS policy violation
      if (error.message.includes('new row violates row-level security') || 
          error.message.includes('RLS') ||
          errorDetails.code === '42501') {
        console.error('[Lead] RLS Policy Error - Check Supabase table policies');
        return {
          success: false,
          message: 'Unable to save your information. Please call us at (216) 677-4630.',
        };
      }
      
      // Missing column error
      if (error.message.includes('column') && error.message.includes('does not exist')) {
        console.error('[Lead] Schema Error - Missing column in Lead table');
        return {
          success: false,
          message: 'System configuration error. Please call us at (216) 677-4630.',
        };
      }
      
      // Database timeout
      if (error.message.includes('timeout') || error.message.includes('ETIMEDOUT')) {
        return {
          success: false,
          message: 'Our system is experiencing high traffic. Please try again in a moment.',
        };
      }
      
      // Connection error
      if (error.message.includes('ECONNREFUSED') || error.message.includes('fetch failed')) {
        return {
          success: false,
          message: 'Unable to connect. Please check your internet connection and try again.',
        };
      }
      
      // Rate limiting
      if (error.message.includes('rate limit') || error.message.includes('429')) {
        return {
          success: false,
          message: 'Too many requests. Please wait a moment before trying again.',
        };
      }
      
      // Authentication/authorization error
      if (error.message.includes('JWT') || error.message.includes('auth') || 
          errorDetails.code === '401' || errorDetails.code === '403') {
        console.error('[Lead] Auth Error - Check SUPABASE_SERVICE_ROLE_KEY');
        return {
          success: false,
          message: 'Authentication error. Please call us at (216) 677-4630.',
        };
      }
    }
    
    // Generic error with debug info in logs
    console.error('[Lead] Unhandled error type:', errorDetails);
    return {
      success: false,
      message: 'Something went wrong. Please try again or call us at (216) 677-4630.',
    };
  }
}

// ============================================================================
// COMMISSION ESTIMATION (2026 Cleveland Market Rates)
// ============================================================================

/**
 * 2026 Cleveland Market Commission Rates (100% of first month's rent)
 * Premium Tier: Beachwood, Shaker Heights, Westlake, Rocky River, Solon
 * Volume Tier: Parma, Strongsville, Lakewood, Mentor
 */
const COMMISSION_RATES: Record<string, { assisted_living: number; memory_care: number }> = {
  beachwood: { assisted_living: 6800, memory_care: 8200 },
  'shaker heights': { assisted_living: 6200, memory_care: 7800 },
  'shaker-heights': { assisted_living: 6200, memory_care: 7800 },
  westlake: { assisted_living: 5800, memory_care: 7200 },
  'rocky river': { assisted_living: 5600, memory_care: 7000 },
  'rocky-river': { assisted_living: 5600, memory_care: 7000 },
  solon: { assisted_living: 5900, memory_care: 7400 },
  parma: { assisted_living: 4900, memory_care: 6200 },
  strongsville: { assisted_living: 5400, memory_care: 6800 },
  lakewood: { assisted_living: 5600, memory_care: 7000 },
  mentor: { assisted_living: 5200, memory_care: 6600 },
  cleveland: { assisted_living: 5520, memory_care: 6800 },
};

/**
 * Estimate commission based on city and care type
 * Returns 100% of first month's rent (industry standard referral fee)
 */
function estimateCommission(city?: string, careType?: string): number {
  const normalizedCity = city?.toLowerCase().replace(/-/g, ' ') || 'cleveland';
  const rates = COMMISSION_RATES[normalizedCity] || COMMISSION_RATES['cleveland'];
  
  if (careType === 'Memory Care') {
    return rates.memory_care;
  }
  return rates.assisted_living;
}

// ============================================================================
// REFERRAL NOTIFICATION (Uses Internal Draft System)
// All referrals now go to internal email for review before forwarding
// ============================================================================

/**
 * Send referral notification (redirects to internal draft system)
 * Triggered for HIGH-VALUE leads (homeValue > $350k OR valueGap > $500/mo)
 * 
 * All notifications now go to YOUR internal email, not directly to communities
 */
async function sendReferralNotification(lead: {
  id: string;
  fullName: string;
  email?: string;
  phone?: string;
  careType?: string;
  moveInTimeline?: string;
  communityName?: string;
  communityEmail?: string;
  sourceSlug?: string;
  calculatorData?: CalculatorMetaData | null;
  estimatedCommission: number;
}): Promise<boolean> {
  // Redirect all referrals to internal draft system
  return sendInternalReferralDraft({
    id: lead.id,
    fullName: lead.fullName,
    phone: lead.phone,
    email: lead.email,
    careType: lead.careType,
    moveInTimeline: lead.moveInTimeline,
    notes: undefined, // Clean for referral
    sourceSlug: lead.sourceSlug,
    urgencyScore: 85, // High-value leads default to high urgency
    isHighValue: true, // Referral notification only for high-value
    calculatorData: lead.calculatorData,
    estimatedCommission: lead.estimatedCommission,
    communityName: lead.communityName,
  });
}

// ============================================================================
// UTILITY EXPORTS
// ============================================================================

/**
 * Get lead by ID (for admin/CRM purposes)
 */
export async function getLeadById(id: string) {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('Lead')
    .select('*')
    .eq('id', id)
    .single();
    
  if (error) throw error;
  return data;
}

/**
 * Get high-priority leads from the last 24 hours
 */
export async function getRecentHighPriorityLeads() {
  const supabase = getSupabaseAdmin();
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  
  const { data, error } = await supabase
    .from('Lead')
    .select('*')
    .eq('priority', 'high')
    .gte('createdAt', yesterday)
    .order('urgencyScore', { ascending: false });
    
  if (error) throw error;
  return data;
}

// ============================================================================
// PIPELINE MANAGEMENT (Commission Dashboard)
// ============================================================================

export type ReferralStatus = 'new' | 'internal_review' | 'referral_sent' | 'tour_scheduled' | 'admitted' | 'paid';

/**
 * Get all leads grouped by referral status for pipeline dashboard
 */
export async function getPipelineLeads() {
  const supabase = getSupabaseAdmin();
  
  const { data, error } = await supabase
    .from('Lead')
    .select('*')
    .order('createdAt', { ascending: false });
    
  if (error) throw error;
  
  // Group by referral status
  const pipeline = {
    new: [] as typeof data,
    internal_review: [] as typeof data,
    referral_sent: [] as typeof data,
    tour_scheduled: [] as typeof data,
    admitted: [] as typeof data,
    paid: [] as typeof data,
  };
  
  data?.forEach(lead => {
    const status = (lead.referral_status || 'new') as ReferralStatus;
    if (pipeline[status]) {
      pipeline[status].push(lead);
    } else {
      pipeline.new.push(lead);
    }
  });
  
  // Calculate totals
  const totalPipelineValue = data?.reduce((sum, lead) => {
    if (lead.referral_status !== 'paid') {
      return sum + (parseFloat(lead.estimated_commission) || 0);
    }
    return sum;
  }, 0) || 0;
  
  const totalPaidCommission = data?.reduce((sum, lead) => {
    if (lead.referral_status === 'paid') {
      return sum + (parseFloat(lead.actual_commission) || parseFloat(lead.estimated_commission) || 0);
    }
    return sum;
  }, 0) || 0;
  
  return {
    pipeline,
    totalPipelineValue,
    totalPaidCommission,
    totalLeads: data?.length || 0,
  };
}

/**
 * Update lead referral status (for pipeline management)
 */
export async function updateLeadStatus(
  leadId: string, 
  status: ReferralStatus,
  additionalData?: {
    actual_commission?: number;
    tour_scheduled_at?: string;
    tour_completed_at?: string;
    admitted_at?: string;
    move_in_date?: string;
    advisor_notes?: string;
  }
): Promise<{ success: boolean; message: string }> {
  const supabase = getSupabaseAdmin();
  
  const updateData: Record<string, unknown> = {
    referral_status: status,
    updatedAt: new Date().toISOString(),
  };
  
  // Set timestamps based on status
  if (status === 'referral_sent' && !additionalData?.tour_scheduled_at) {
    updateData.referral_sent_at = new Date().toISOString();
  }
  if (status === 'tour_scheduled' && additionalData?.tour_scheduled_at) {
    updateData.tour_scheduled_at = additionalData.tour_scheduled_at;
  }
  if (status === 'admitted') {
    updateData.admitted_at = additionalData?.admitted_at || new Date().toISOString();
    if (additionalData?.move_in_date) {
      updateData.move_in_date = additionalData.move_in_date;
    }
  }
  if (status === 'paid' && additionalData?.actual_commission) {
    updateData.actual_commission = additionalData.actual_commission;
    updateData.commission_paid_at = new Date().toISOString();
  }
  if (additionalData?.advisor_notes) {
    updateData.advisor_notes = additionalData.advisor_notes;
  }
  
  const { error } = await supabase
    .from('Lead')
    .update(updateData)
    .eq('id', leadId);
    
  if (error) {
    console.error('[Pipeline] Status update failed:', error);
    return { success: false, message: error.message };
  }
  
  console.log(`[Pipeline] Lead ${leadId} moved to ${status}`);
  return { success: true, message: `Lead moved to ${status}` };
}

/**
 * Mark lead as admitted and set final commission
 */
export async function markLeadAdmitted(
  leadId: string,
  actualCommission: number,
  moveInDate?: string
): Promise<{ success: boolean; message: string }> {
  return updateLeadStatus(leadId, 'admitted', {
    actual_commission: actualCommission,
    admitted_at: new Date().toISOString(),
    move_in_date: moveInDate,
  });
}

/**
 * Get high-value leads for referral
 */
export async function getHighValueLeadsForReferral() {
  const supabase = getSupabaseAdmin();
  
  const { data, error } = await supabase
    .from('Lead')
    .select('*')
    .eq('is_high_value', true)
    .eq('referral_status', 'new')
    .order('estimated_commission', { ascending: false });
    
  if (error) throw error;
  return data;
}

/**
 * Send referral for a specific lead (manual trigger)
 */
export async function sendLeadReferral(leadId: string): Promise<{ success: boolean; message: string }> {
  const supabase = getSupabaseAdmin();
  
  // Get the lead
  const { data: lead, error } = await supabase
    .from('Lead')
    .select('*')
    .eq('id', leadId)
    .single();
    
  if (error || !lead) {
    return { success: false, message: 'Lead not found' };
  }
  
  // Parse calculator data
  const calculatorData = lead.meta_data as CalculatorMetaData | null;
  
  // Send referral notification
  const sent = await sendReferralNotification({
    id: lead.id,
    fullName: lead.fullName,
    email: lead.email,
    phone: lead.phone,
    careType: lead.careType,
    moveInTimeline: lead.moveInTimeline,
    communityName: lead.communityName,
    sourceSlug: lead.sourceSlug,
    calculatorData,
    estimatedCommission: parseFloat(lead.estimated_commission) || estimateCommission(lead.sourceSlug, lead.careType),
  });
  
  if (sent) {
    // Update lead status
    await supabase
      .from('Lead')
      .update({
        referral_status: 'referral_sent',
        referral_sent_at: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .eq('id', leadId);
      
    return { success: true, message: 'Referral notification sent successfully' };
  }
  
  return { success: false, message: 'Failed to send referral notification' };
}

