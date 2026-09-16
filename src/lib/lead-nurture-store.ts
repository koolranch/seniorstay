import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import {
  buildNurtureEmail,
  evaluateNurtureEligibility,
  formatNurtureLabel,
  isWeekdaySendWindow,
  nextWeekdaySendAt,
  NURTURE_DEDUP_DAYS,
  NURTURE_EMAIL1_DELAY_MS,
  NURTURE_EMAIL2_DELAY_MS,
  NurtureLeadSnapshot,
  NurtureRowSummary,
  NurtureSkipReason,
  NurtureStep,
  shouldCancelNurture,
} from '@/lib/lead-nurture';

const NURTURE_TABLE = 'gfs_lead_nurture';
const NOTIFICATION_EMAIL = 'jocelynn@guideforseniors.com';
const PRIMARY_FROM = 'Jocelynn at Guide for Seniors <jocelynn@guideforseniors.com>';
const FALLBACK_FROM = 'Jocelynn at Guide for Seniors <nurture@guideforseniors.com>';

type NurtureRow = {
  id: string;
  lead_id: string;
  email: string;
  phone: string | null;
  sequence_key: string;
  step: NurtureStep;
  status: 'scheduled' | 'sent' | 'cancelled' | 'skipped';
  scheduled_for: string;
  sent_at: string | null;
  cancelled_at: string | null;
  cancel_reason: string | null;
  skip_reason: string | null;
  resend_message_id: string | null;
};

function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://hncgnxbooghjhpncujzx.supabase.co';
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseServiceKey) {
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!anonKey) {
      throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY');
    }
    return createClient(supabaseUrl, anonKey);
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

function getResend() {
  return process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
}

async function hasRecentSequence(sequenceKey: string, now = new Date()): Promise<boolean> {
  const supabase = getSupabaseAdmin();
  const since = new Date(now.getTime() - NURTURE_DEDUP_DAYS * 24 * 60 * 60 * 1000).toISOString();
  const { count, error } = await supabase
    .from(NURTURE_TABLE)
    .select('id', { count: 'exact', head: true })
    .eq('sequence_key', sequenceKey)
    .gte('created_at', since);

  if (error) {
    throw error;
  }

  return (count || 0) > 0;
}

export async function scheduleLeadNurture(
  lead: NurtureLeadSnapshot,
  now = new Date()
): Promise<{ scheduled: boolean; reason?: NurtureSkipReason | 'tour_cancelled' }> {
  try {
    if (shouldCancelNurture({
      status: lead.status,
      referralStatus: lead.referral_status,
      advisorNotes: lead.advisor_notes,
      pageType: lead.pageType,
      notes: lead.notes,
    })) {
      await cancelLeadNurture(lead.id, lead.pageType === 'tour_request' ? 'tour_booked' : 'not_eligible');
      return { scheduled: false, reason: 'tour_cancelled' };
    }

    const eligibility = evaluateNurtureEligibility(lead);
    if (!eligibility.ok) {
      if (eligibility.reason === 'tour_booked') {
        await cancelLeadNurture(lead.id, 'tour_booked');
      }
      return { scheduled: false, reason: eligibility.reason };
    }

    if (await hasRecentSequence(eligibility.sequenceKey, now)) {
      return { scheduled: false, reason: 'duplicate_sequence' };
    }

    const supabase = getSupabaseAdmin();
    const scheduledFor = nextWeekdaySendAt(now, NURTURE_EMAIL1_DELAY_MS).toISOString();
    const { error } = await supabase.from(NURTURE_TABLE).insert({
      lead_id: lead.id,
      email: eligibility.email,
      phone: lead.phone || null,
      sequence_key: eligibility.sequenceKey,
      step: 1,
      status: 'scheduled',
      scheduled_for: scheduledFor,
      updated_at: now.toISOString(),
    });

    if (error) {
      throw error;
    }

    console.log(`[Nurture] Scheduled step 1 for lead ${lead.id} at ${scheduledFor}`);
    return { scheduled: true };
  } catch (error) {
    console.error('[Nurture] Failed to schedule follow-up:', error);
    return { scheduled: false };
  }
}

export async function cancelLeadNurture(
  leadId: string,
  reason: string
): Promise<number> {
  try {
    const supabase = getSupabaseAdmin();
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from(NURTURE_TABLE)
      .update({
        status: 'cancelled',
        cancelled_at: now,
        cancel_reason: reason,
        updated_at: now,
      })
      .eq('lead_id', leadId)
      .eq('status', 'scheduled')
      .select('id');

    if (error) {
      throw error;
    }

    const cancelled = data?.length || 0;
    if (cancelled > 0) {
      console.log(`[Nurture] Cancelled ${cancelled} pending follow-up(s) for lead ${leadId}: ${reason}`);
    }
    return cancelled;
  } catch (error) {
    console.error('[Nurture] Failed to cancel follow-ups:', error);
    return 0;
  }
}

async function sendFamilyEmail(params: {
  to: string;
  subject: string;
  html: string;
  text: string;
}): Promise<{ id?: string; from: string } | null> {
  const resend = getResend();
  if (!resend) {
    console.warn('[Nurture] Resend not configured, skipping family email');
    return null;
  }

  const attempts = [PRIMARY_FROM, FALLBACK_FROM];
  for (const from of attempts) {
    const { data, error } = await resend.emails.send({
      from,
      to: params.to,
      replyTo: NOTIFICATION_EMAIL,
      subject: params.subject,
      html: params.html,
      text: params.text,
    });

    if (!error) {
      return { id: data?.id, from };
    }

    console.warn(`[Nurture] Send from ${from} failed:`, error);
  }

  return null;
}

async function notifyAdvisor(params: {
  leadId: string;
  fullName?: string | null;
  email: string;
  step: NurtureStep;
  from: string;
}): Promise<void> {
  const resend = getResend();
  if (!resend) {
    return;
  }

  const subject = `Nurture email ${params.step} sent: ${params.fullName || params.email}`;
  await resend.emails.send({
    from: 'Guide for Seniors <notifications@guideforseniors.com>',
    to: NOTIFICATION_EMAIL,
    subject,
    text: [
      `A follow-up email just went to ${params.fullName || 'a family'} (${params.email}).`,
      `Step: ${params.step} of 2`,
      `From: ${params.from}`,
      `Lead: ${params.leadId}`,
      'If they reply, it will come to jocelynn@guideforseniors.com — Resend inbound is not enabled, so replies need a human inbox.',
    ].join('\n'),
  });
}

async function markRow(
  id: string,
  values: Record<string, unknown>
): Promise<void> {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from(NURTURE_TABLE)
    .update({
      ...values,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) {
    throw error;
  }
}

async function loadLead(leadId: string): Promise<NurtureLeadSnapshot | null> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('Lead')
    .select('id, fullName, email, phone, pageType, careType, status, referral_status, advisor_notes, notes')
    .eq('id', leadId)
    .single();

  if (error || !data) {
    return null;
  }

  return data as NurtureLeadSnapshot;
}

async function scheduleSecondEmail(row: NurtureRow, lead: NurtureLeadSnapshot, now: Date): Promise<void> {
  const supabase = getSupabaseAdmin();
  const scheduledFor = nextWeekdaySendAt(now, NURTURE_EMAIL2_DELAY_MS).toISOString();
  const { error } = await supabase.from(NURTURE_TABLE).insert({
    lead_id: row.lead_id,
    email: row.email,
    phone: row.phone,
    sequence_key: row.sequence_key,
    step: 2,
    status: 'scheduled',
    scheduled_for: scheduledFor,
    updated_at: now.toISOString(),
  });

  if (error) {
    console.error('[Nurture] Failed to schedule step 2:', error);
    return;
  }

  console.log(`[Nurture] Scheduled step 2 for lead ${lead.id} at ${scheduledFor}`);
}

export async function processDueNurtureEmails(now = new Date()): Promise<{
  scanned: number;
  sent: number;
  skipped: number;
  cancelled: number;
}> {
  const summary = { scanned: 0, sent: 0, skipped: 0, cancelled: 0 };

  if (!isWeekdaySendWindow(now)) {
    return summary;
  }

  const supabase = getSupabaseAdmin();
  const { data: dueRows, error } = await supabase
    .from(NURTURE_TABLE)
    .select('*')
    .eq('status', 'scheduled')
    .lte('scheduled_for', now.toISOString())
    .order('scheduled_for', { ascending: true })
    .limit(25);

  if (error) {
    throw error;
  }

  for (const raw of dueRows || []) {
    const row = raw as NurtureRow;
    summary.scanned += 1;

    const lead = await loadLead(row.lead_id);
    if (!lead) {
      await markRow(row.id, { status: 'skipped', skip_reason: 'lead_missing' });
      summary.skipped += 1;
      continue;
    }

    if (shouldCancelNurture({
      status: lead.status,
      referralStatus: lead.referral_status,
      advisorNotes: lead.advisor_notes,
      pageType: lead.pageType,
      notes: lead.notes,
    })) {
      await cancelLeadNurture(lead.id, 'became_ineligible');
      summary.cancelled += 1;
      continue;
    }

    const eligibility = evaluateNurtureEligibility(lead);
    if (!eligibility.ok) {
      await markRow(row.id, { status: 'skipped', skip_reason: eligibility.reason });
      if (row.step === 1) {
        await cancelLeadNurture(lead.id, eligibility.reason);
      }
      summary.skipped += 1;
      continue;
    }

    const copy = buildNurtureEmail(row.step, lead.fullName);
    const sent = await sendFamilyEmail({
      to: eligibility.email,
      subject: copy.subject,
      html: copy.html,
      text: copy.text,
    });

    if (!sent?.id) {
      console.error(`[Nurture] Send failed for lead ${lead.id} step ${row.step}`);
      continue;
    }

    await markRow(row.id, {
      status: 'sent',
      sent_at: now.toISOString(),
      resend_message_id: sent.id,
    });
    summary.sent += 1;

    await notifyAdvisor({
      leadId: lead.id,
      fullName: lead.fullName,
      email: eligibility.email,
      step: row.step,
      from: sent.from,
    });

    if (row.step === 1) {
      await scheduleSecondEmail(row, lead, now);
    }
  }

  return summary;
}

export async function getNurtureSummariesByLeadIds(
  leadIds: string[]
): Promise<Record<string, string>> {
  if (!leadIds.length) {
    return {};
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from(NURTURE_TABLE)
    .select('lead_id, step, status, scheduled_for, sent_at, cancel_reason')
    .in('lead_id', leadIds);

  if (error || !data) {
    if (error) {
      console.error('[Nurture] Failed to load summaries:', error);
    }
    return {};
  }

  const grouped = new Map<string, NurtureRowSummary[]>();
  for (const row of data as Array<{
    lead_id: string;
    step: NurtureStep;
    status: NurtureRowSummary['status'];
    scheduled_for: string | null;
    sent_at: string | null;
    cancel_reason: string | null;
  }>) {
    const list = grouped.get(row.lead_id) || [];
    list.push({
      leadId: row.lead_id,
      step: row.step,
      status: row.status,
      scheduledFor: row.scheduled_for,
      sentAt: row.sent_at,
      cancelReason: row.cancel_reason,
    });
    grouped.set(row.lead_id, list);
  }

  const labels: Record<string, string> = {};
  for (const [leadId, rows] of grouped) {
    const label = formatNurtureLabel(rows);
    if (label) {
      labels[leadId] = label;
    }
  }
  return labels;
}
