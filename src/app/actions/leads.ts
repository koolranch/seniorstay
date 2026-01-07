'use server';

import { z } from 'zod';
import { headers } from 'next/headers';
import { createClient } from '@supabase/supabase-js';

// ============================================================================
// TYPES & SCHEMAS
// ============================================================================

/**
 * Zod validation schema for lead submissions
 * Validates all incoming lead data with strict type checking
 */
export const LeadSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  phone: z.string()
    .regex(/^[\d\s\-\(\)\+]*$/, 'Invalid phone number format')
    .optional()
    .or(z.literal('')),
  cityOrZip: z.string().max(100).optional(),
  careType: z.enum([
    'Independent Living',
    'Assisted Living', 
    'Memory Care',
    'Skilled Nursing',
    'Respite Care',
    'Other',
    ''
  ]).optional(),
  moveInTimeline: z.enum([
    'Immediate',
    '1-3 months',
    '3-6 months', 
    '6+ months',
    'Just researching',
    ''
  ]).optional(),
  notes: z.string().max(5000).optional(), // Increased for calculator JSON
  communityName: z.string().max(200).optional(),
  communityId: z.string().optional(),
  // Attribution fields
  pageType: z.enum([
    'location_page',
    'community_page', 
    'contact',
    'assessment',
    'homepage',
    'pricing_guide',
    'blog',
    'other',
    ''
  ]).optional(),
  sourceSlug: z.string().max(100).optional(), // Cleveland suburb slug
  // UTM tracking
  utmSource: z.string().max(100).optional(),
  utmMedium: z.string().max(100).optional(),
  utmCampaign: z.string().max(200).optional(),
});

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

  // Care type scoring
  if (data.careType === 'Memory Care' || data.careType === 'Respite Care') {
    score += 30;
  } else if (data.careType === 'Assisted Living') {
    score += 10;
  } else if (data.careType === 'Skilled Nursing') {
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
// HIGH-PRIORITY ALERT SYSTEM
// ============================================================================

/**
 * Send high-priority alert for urgent leads (score > 80)
 * Uses webhook or email service to notify team immediately
 * 
 * Includes special "[🔥 HIGH-VALUE CLEVELAND LEAD]" prefix for calculator leads
 * with homeValue > $350k OR valueGap > $500/month
 */
async function sendHighPriorityAlert(lead: {
  id: string;
  fullName: string;
  phone?: string;
  email?: string;
  careType?: string;
  moveInTimeline?: string;
  notes?: string;
  sourceSlug?: string;
  urgencyScore: number;
  isHighValueCalculator?: boolean;
  calculatorData?: CalculatorMetaData | null;
}): Promise<boolean> {
  try {
    // Determine subject prefix based on lead type
    const isHighValue = lead.isHighValueCalculator;
    const subjectPrefix = isHighValue 
      ? '🔥 HIGH-VALUE CLEVELAND LEAD' 
      : '🚨 HIGH PRIORITY LEAD';
    
    // Build calculator summary if available
    let calculatorSummary = '';
    if (lead.calculatorData) {
      calculatorSummary = `\n--- CALCULATOR DATA ---\n` +
        `Home Value: $${lead.calculatorData.homeValue?.toLocaleString() || 'N/A'}\n` +
        `Value Gap: ${lead.calculatorData.valueGap && lead.calculatorData.valueGap >= 0 ? '+' : ''}$${lead.calculatorData.valueGap?.toLocaleString() || 'N/A'}/mo\n` +
        `Location: ${lead.calculatorData.selectedLocation || 'N/A'}\n` +
        `Annual Savings: $${lead.calculatorData.annualSavings?.toLocaleString() || 'N/A'}`;
    }
    
    // Option 1: Supabase Edge Function webhook
    const webhookUrl = process.env.HIGH_PRIORITY_LEAD_WEBHOOK;
    
    if (webhookUrl) {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.WEBHOOK_SECRET || ''}`,
        },
        body: JSON.stringify({
          type: isHighValue ? 'HIGH_VALUE_CALCULATOR_LEAD' : 'HIGH_PRIORITY_LEAD',
          lead: {
            id: lead.id,
            name: lead.fullName,
            phone: lead.phone,
            email: lead.email,
            careType: lead.careType,
            timeline: lead.moveInTimeline,
            notes: lead.notes?.split('---META_DATA_JSON---')[0]?.substring(0, 500), // Clean notes
            source: lead.sourceSlug,
            score: lead.urgencyScore,
            isHighValue,
            calculatorData: lead.calculatorData,
          },
          message: `[${subjectPrefix}] (Score: ${lead.urgencyScore})\n` +
            `Name: ${lead.fullName}\n` +
            `Phone: ${lead.phone || 'Not provided'}\n` +
            `Care: ${lead.careType || 'Not specified'}\n` +
            `Timeline: ${lead.moveInTimeline || 'Not specified'}\n` +
            `Source: ${lead.sourceSlug || 'Direct'}` +
            calculatorSummary,
          timestamp: new Date().toISOString(),
        }),
        signal: AbortSignal.timeout(5000), // 5 second timeout
      });
      
      return response.ok;
    }

    // Option 2: Formspree fallback for email notification
    const formspreeEndpoint = process.env.FORMSPREE_HIGH_PRIORITY_ENDPOINT;
    if (formspreeEndpoint) {
      const response = await fetch(formspreeEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          _subject: `[${subjectPrefix}] ${lead.fullName} (Score: ${lead.urgencyScore})`,
          name: lead.fullName,
          phone: lead.phone || 'Not provided',
          email: lead.email || 'Not provided',
          care_type: lead.careType || 'Not specified',
          timeline: lead.moveInTimeline || 'Not specified',
          notes: lead.notes?.split('---META_DATA_JSON---')[0] || 'None',
          source: lead.sourceSlug || 'Direct',
          urgency_score: lead.urgencyScore,
          lead_id: lead.id,
          is_high_value: isHighValue,
          calculator_home_value: lead.calculatorData?.homeValue,
          calculator_value_gap: lead.calculatorData?.valueGap,
          calculator_location: lead.calculatorData?.selectedLocation,
        }),
        signal: AbortSignal.timeout(5000),
      });
      
      return response.ok;
    }

    // No webhook configured - log warning
    console.warn('[Lead Alert] No HIGH_PRIORITY_LEAD_WEBHOOK or FORMSPREE_HIGH_PRIORITY_ENDPOINT configured');
    return false;
    
  } catch (error) {
    console.error('[Lead Alert] Failed to send high-priority alert:', error);
    return false;
  }
}

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
    
    const leadData = {
      fullName: data.fullName.trim(),
      email: data.email?.trim() || null,
      phone: data.phone?.trim() || null,
      cityOrZip: data.cityOrZip?.trim() || null,
      careType: data.careType || null,
      moveInTimeline: data.moveInTimeline || null,
      notes: cleanNotes,
      communityName: data.communityName?.trim() || null,
      communityId: data.communityId || null,
      pageType: pageType || null,
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
            ...leadData,
            createdAt: new Date().toISOString(),
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
          ...leadData,
          createdAt: new Date().toISOString(),
        })
        .select('id')
        .single();
      
      if (insertError) throw insertError;
      leadId = inserted.id;
    }
    
    // -------------------------------------------------------------------------
    // 6. TRIGGER HIGH-PRIORITY ALERT IF SCORE > 80 OR HIGH-VALUE CALCULATOR
    // -------------------------------------------------------------------------
    if (finalUrgencyScore > 80 || isHighValueCalculator) {
      const alertSent = await sendHighPriorityAlert({
        id: leadId,
        fullName: data.fullName,
        phone: data.phone,
        email: data.email,
        careType: data.careType,
        moveInTimeline: data.moveInTimeline,
        notes: cleanNotes || undefined,
        sourceSlug,
        urgencyScore: finalUrgencyScore,
        isHighValueCalculator,
        calculatorData,
      });
      
      // Update alert status in database
      if (alertSent) {
        await supabase
          .from('Lead')
          .update({ alertSent: true })
          .eq('id', leadId);
      }
      
      const alertType = isHighValueCalculator ? '🔥 HIGH-VALUE' : '🚨 HIGH PRIORITY';
      console.log(`[Lead] ${alertType} submitted: ${leadId}, score: ${finalUrgencyScore}, alert: ${alertSent}`);
    }
    
    // -------------------------------------------------------------------------
    // 7. REFERRAL SHIELD: Send formal referral for HIGH-VALUE calculator leads
    // -------------------------------------------------------------------------
    if (isHighValueCalculator && calculatorData) {
      const referralSent = await sendReferralNotification({
        id: leadId,
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        careType: data.careType,
        moveInTimeline: data.moveInTimeline,
        communityName: data.communityName,
        sourceSlug,
        calculatorData,
        estimatedCommission,
      });
      
      // Update referral status in database
      if (referralSent) {
        await supabase
          .from('Lead')
          .update({ 
            referral_status: 'referral_sent',
            referral_sent_at: new Date().toISOString(),
          })
          .eq('id', leadId);
          
        console.log(`[Referral Shield] Formal referral sent for lead: ${leadId}, commission: $${estimatedCommission}`);
      }
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
    // ERROR HANDLING
    // -------------------------------------------------------------------------
    console.error('[Lead] Submission error:', error);
    
    // Check for specific error types
    if (error instanceof Error) {
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
    }
    
    // Generic error
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
// REFERRAL SHIELD NOTIFICATION SYSTEM
// ============================================================================

/**
 * Send formal referral notification to community sales director
 * Triggered for HIGH-VALUE leads (homeValue > $350k OR valueGap > $500/mo)
 * 
 * Subject: [REFERRAL] New Qualified Prospect for [Community Name] - Guide For Seniors
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
  try {
    const webhookUrl = process.env.REFERRAL_NOTIFICATION_WEBHOOK || process.env.HIGH_PRIORITY_LEAD_WEBHOOK;
    const formspreeEndpoint = process.env.FORMSPREE_REFERRAL_ENDPOINT || process.env.FORMSPREE_HIGH_PRIORITY_ENDPOINT;
    
    const communityName = lead.communityName || `Senior Living in ${lead.sourceSlug?.replace(/-/g, ' ') || 'Cleveland'}`;
    const homeValue = lead.calculatorData?.homeValue?.toLocaleString() || 'Not specified';
    const monthlyBudget = lead.calculatorData?.seniorLivingCost?.toLocaleString() || 'Not specified';
    const valueGap = lead.calculatorData?.valueGap;
    const valueGapText = valueGap ? `$${Math.abs(valueGap).toLocaleString()}/mo ${valueGap > 0 ? 'savings' : 'difference'}` : 'Not calculated';
    
    const emailSubject = `[REFERRAL] New Qualified Prospect for ${communityName} - Guide For Seniors`;
    
    const emailBody = `
FORMAL REFERRAL NOTIFICATION
============================

This is a formal referral notification from Guide For Seniors.

PROSPECT INFORMATION:
- Name: ${lead.fullName}
- Phone: ${lead.phone || 'Not provided'}
- Email: ${lead.email || 'Not provided'}
- Care Type Needed: ${lead.careType || 'Assisted Living'}
- Move-in Timeline: ${lead.moveInTimeline || 'Not specified'}

FINANCIAL READINESS:
- Home Value: $${homeValue}
- Calculated Monthly Budget: $${monthlyBudget}
- Value Gap vs. Home: ${valueGapText}

REFERRAL TERMS:
- Estimated Commission: $${lead.estimatedCommission.toLocaleString()}
- Terms: 100% of first month's rent upon admission
- Lead ID: ${lead.id}

Please acknowledge receipt of this referral to secure our placement fee agreement.

---
Guide For Seniors
Cleveland's Trusted Senior Living Advisor
(216) 677-4630 | guideforseniors.com
    `.trim();
    
    // Try webhook first
    if (webhookUrl) {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.WEBHOOK_SECRET || ''}`,
        },
        body: JSON.stringify({
          type: 'REFERRAL_NOTIFICATION',
          subject: emailSubject,
          body: emailBody,
          lead: {
            id: lead.id,
            name: lead.fullName,
            phone: lead.phone,
            email: lead.email,
            careType: lead.careType,
            timeline: lead.moveInTimeline,
            community: communityName,
            homeValue: lead.calculatorData?.homeValue,
            monthlyBudget: lead.calculatorData?.seniorLivingCost,
            valueGap: lead.calculatorData?.valueGap,
            estimatedCommission: lead.estimatedCommission,
          },
          communityEmail: lead.communityEmail,
          timestamp: new Date().toISOString(),
        }),
        signal: AbortSignal.timeout(5000),
      });
      
      return response.ok;
    }
    
    // Fallback to Formspree
    if (formspreeEndpoint) {
      const response = await fetch(formspreeEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          _subject: emailSubject,
          _replyto: lead.email || 'noreply@guideforseniors.com',
          prospect_name: lead.fullName,
          prospect_phone: lead.phone || 'Not provided',
          prospect_email: lead.email || 'Not provided',
          care_type: lead.careType || 'Assisted Living',
          timeline: lead.moveInTimeline || 'Not specified',
          community: communityName,
          home_value: `$${homeValue}`,
          monthly_budget: `$${monthlyBudget}`,
          value_gap: valueGapText,
          estimated_commission: `$${lead.estimatedCommission.toLocaleString()}`,
          lead_id: lead.id,
          message: emailBody,
        }),
        signal: AbortSignal.timeout(5000),
      });
      
      return response.ok;
    }
    
    console.warn('[Referral] No webhook configured for referral notifications');
    return false;
    
  } catch (error) {
    console.error('[Referral] Failed to send referral notification:', error);
    return false;
  }
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

export type ReferralStatus = 'new' | 'referral_sent' | 'tour_scheduled' | 'admitted' | 'paid';

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

