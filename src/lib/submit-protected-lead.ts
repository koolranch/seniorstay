'use client';

import {
  getLeadSubmissionToken,
  submitLead,
  type LeadInput,
  type LeadSubmitResult,
} from '@/app/actions/leads';

type ProtectedLeadInput = LeadInput & {
  submissionToken?: string;
};

/**
 * Submit a lead with anti-spam token. Prefer useLeadSubmit / useLeadSubmissionToken
 * so the token is issued when the form loads (3s minimum age before submit).
 */
export async function submitProtectedLead(
  data: ProtectedLeadInput,
): Promise<LeadSubmitResult> {
  const submissionToken = data.submissionToken || (await getLeadSubmissionToken());

  return submitLead({
    website: data.website ?? '',
    submissionStartedAt: data.submissionStartedAt,
    submissionToken,
    ...data,
  });
}

export { getLeadSubmissionToken };
