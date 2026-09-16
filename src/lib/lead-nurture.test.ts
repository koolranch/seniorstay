import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  advisorNotesIndicateContact,
  buildNurtureEmail,
  evaluateNurtureEligibility,
  formatNurtureLabel,
  isBookedCallbackLead,
  isSkilledNursingCareType,
  isWeekdaySendWindow,
  nextWeekdaySendAt,
  nurtureSequenceKey,
  shouldCancelNurture,
} from './lead-nurture';

const THURSDAY_11ET = new Date('2026-09-17T15:00:00.000Z'); // 11:00 ET
const FRIDAY_16ET = new Date('2026-09-18T20:00:00.000Z'); // 16:00 ET
const SATURDAY_12ET = new Date('2026-09-19T16:00:00.000Z');

function eligibleLead(overrides: Record<string, unknown> = {}) {
  return {
    id: 'lead-1',
    fullName: 'Mary Smith',
    email: 'mary@example.com',
    phone: '2163217890',
    pageType: 'contact',
    careType: 'Assisted Living',
    status: 'new',
    referral_status: 'internal_review',
    advisor_notes: null,
    notes: 'Looking for help this month',
    ...overrides,
  };
}

describe('evaluateNurtureEligibility', () => {
  it('allows an opted-in contact lead', () => {
    const result = evaluateNurtureEligibility(eligibleLead());
    assert.equal(result.ok, true);
    if (result.ok) {
      assert.equal(result.email, 'mary@example.com');
      assert.equal(result.sequenceKey, 'mary@example.com|2163217890');
    }
  });

  it('skips missing email', () => {
    const result = evaluateNurtureEligibility(eligibleLead({ email: '' }));
    assert.deepEqual(result, { ok: false, reason: 'no_email' });
  });

  it('skips disposable email', () => {
    const result = evaluateNurtureEligibility(eligibleLead({ email: 'bot@mailinator.com' }));
    assert.deepEqual(result, { ok: false, reason: 'disposable_email' });
  });

  it('skips spam-looking names', () => {
    const result = evaluateNurtureEligibility(eligibleLead({
      fullName: 'ddPPJqvSmScFTyaUqYl',
    }));
    assert.deepEqual(result, { ok: false, reason: 'spam' });
  });

  it('skips already contacted leads', () => {
    const result = evaluateNurtureEligibility(eligibleLead({ status: 'contacted' }));
    assert.deepEqual(result, { ok: false, reason: 'already_contacted' });
  });

  it('skips qualified, converted, and lost', () => {
    for (const status of ['qualified', 'converted', 'lost']) {
      const result = evaluateNurtureEligibility(eligibleLead({ status }));
      assert.deepEqual(result, { ok: false, reason: 'already_contacted' });
    }
  });

  it('allows internal_review but skips later pipeline statuses', () => {
    assert.equal(evaluateNurtureEligibility(eligibleLead({ referral_status: 'new' })).ok, true);
    assert.equal(evaluateNurtureEligibility(eligibleLead({ referral_status: 'internal_review' })).ok, true);
    assert.deepEqual(
      evaluateNurtureEligibility(eligibleLead({ referral_status: 'referral_sent' })),
      { ok: false, reason: 'pipeline_advanced' }
    );
    assert.deepEqual(
      evaluateNurtureEligibility(eligibleLead({ referral_status: 'tour_scheduled' })),
      { ok: false, reason: 'pipeline_advanced' }
    );
  });

  it('skips advisor notes that say they already spoke', () => {
    const result = evaluateNurtureEligibility(eligibleLead({
      advisor_notes: 'Spoke with daughter this morning',
    }));
    assert.deepEqual(result, { ok: false, reason: 'already_spoke' });
  });

  it('skips skilled nursing', () => {
    const result = evaluateNurtureEligibility(eligibleLead({ careType: 'Skilled Nursing' }));
    assert.deepEqual(result, { ok: false, reason: 'skilled_nursing' });
    assert.equal(isSkilledNursingCareType('Skilled Nursing'), true);
  });

  it('skips homepage magnets and community pages', () => {
    assert.deepEqual(
      evaluateNurtureEligibility(eligibleLead({ pageType: 'homepage' })),
      { ok: false, reason: 'ineligible_page' }
    );
    assert.deepEqual(
      evaluateNurtureEligibility(eligibleLead({ pageType: 'community_page' })),
      { ok: false, reason: 'ineligible_page' }
    );
  });

  it('skips scheduled tours', () => {
    assert.deepEqual(
      evaluateNurtureEligibility(eligibleLead({ pageType: 'tour_request' })),
      { ok: false, reason: 'tour_booked' }
    );
    assert.deepEqual(
      evaluateNurtureEligibility(eligibleLead({
        pageType: 'community_page',
        notes: 'Tour scheduled: Monday, September 21, 2026 at 10:00 AM for Vitalia',
      })),
      { ok: false, reason: 'tour_booked' }
    );
  });

  it('allows calculator and assessment page types', () => {
    assert.equal(evaluateNurtureEligibility(eligibleLead({ pageType: 'pricing_guide' })).ok, true);
    assert.equal(evaluateNurtureEligibility(eligibleLead({ pageType: 'assessment' })).ok, true);
    assert.equal(evaluateNurtureEligibility(eligibleLead({ pageType: 'advisor_request' })).ok, true);
    assert.equal(evaluateNurtureEligibility(eligibleLead({ pageType: 'other' })).ok, true);
  });
});

describe('nextWeekdaySendAt', () => {
  it('keeps a Thursday 11am + 24h send on Friday morning in-window', () => {
    const sendAt = nextWeekdaySendAt(THURSDAY_11ET, 24 * 60 * 60 * 1000);
    assert.equal(isWeekdaySendWindow(sendAt), true);
    assert.equal(sendAt.toISOString(), '2026-09-18T15:00:00.000Z');
  });

  it('rolls Friday afternoon + 24h to Monday 10am ET', () => {
    const sendAt = nextWeekdaySendAt(FRIDAY_16ET, 24 * 60 * 60 * 1000);
    assert.equal(sendAt.toISOString(), '2026-09-21T14:00:00.000Z');
    assert.equal(isWeekdaySendWindow(sendAt), true);
  });

  it('does not send on Saturday', () => {
    const sendAt = nextWeekdaySendAt(SATURDAY_12ET, 0);
    assert.equal(sendAt.toISOString(), '2026-09-21T14:00:00.000Z');
  });
});

describe('cancel and callback helpers', () => {
  it('cancels when Jocelynn marks contacted or a tour is booked', () => {
    assert.equal(shouldCancelNurture({ status: 'contacted' }), true);
    assert.equal(shouldCancelNurture({ referralStatus: 'tour_scheduled' }), true);
    assert.equal(shouldCancelNurture({ advisorNotes: 'Called mom, left voicemail' }), true);
    assert.equal(shouldCancelNurture({ pageType: 'tour_request' }), true);
    assert.equal(shouldCancelNurture({ status: 'new', referralStatus: 'internal_review' }), false);
  });

  it('treats contact/advisor/other with a phone as booked-callback, not calculator', () => {
    assert.equal(isBookedCallbackLead('contact', '216-321-7890'), true);
    assert.equal(isBookedCallbackLead('advisor_request', '2163217890'), true);
    assert.equal(isBookedCallbackLead('tour_request', ''), true);
    assert.equal(isBookedCallbackLead('pricing_guide', '2163217890'), false);
    assert.equal(isBookedCallbackLead('contact', ''), false);
  });

  it('dedupes by email plus last 10 phone digits', () => {
    assert.equal(
      nurtureSequenceKey('Mary@Example.com'.toLowerCase(), '+1 (216) 321-7890'),
      'mary@example.com|2163217890'
    );
  });

  it('does not treat ordinary notes as already-spoke', () => {
    assert.equal(advisorNotesIndicateContact('Daughter asked about Westlake pricing'), false);
  });
});

describe('nurture copy', () => {
  it('keeps both emails short, local, and phone-first', () => {
    const first = buildNurtureEmail(1, 'Mary Smith');
    const second = buildNurtureEmail(2, 'Mary Smith');
    assert.match(first.subject, /senior living/i);
    assert.match(first.text, /Hi Mary/);
    assert.match(first.text, /\(216\) 677-4630/);
    assert.doesNotMatch(first.text, /last chance|official|medicaid|nursing home/i);
    assert.match(second.text, /circling back/i);
    assert.match(second.text, /\(216\) 677-4630/);
    assert.doesNotMatch(second.text, /last chance/i);
  });

  it('summarizes scheduled and cancelled sequences', () => {
    assert.match(
      formatNurtureLabel([
        { leadId: '1', step: 1, status: 'scheduled', scheduledFor: '2026-09-21T14:00:00.000Z' },
      ]) || '',
      /Follow-up 1 scheduled/
    );
    assert.equal(
      formatNurtureLabel([
        { leadId: '1', step: 1, status: 'cancelled', cancelReason: 'contacted' },
      ]),
      'Follow-up stopped (contacted)'
    );
  });
});
