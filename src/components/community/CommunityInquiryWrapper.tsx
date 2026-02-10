'use client';

import React, { useState } from 'react';
import InquiryPanel from './InquiryPanel';
import FloatingInquiryButton from './FloatingInquiryButton';
import AdvisorSlideOver from './AdvisorSlideOver';
import ExitIntentPrompt from './ExitIntentPrompt';
import { Button } from '@/components/ui/button';
import { MessageCircle, Users } from 'lucide-react';

interface CommunityInquiryWrapperProps {
  communityName: string;
  communityId?: string;
  communityImage?: string;
  careTypes?: string[];
  overallRating?: number;
  sourceSlug?: string;
  citySlug?: string;
}

/**
 * Client-side wrapper for all inquiry/advisor components on the community detail page.
 * Manages open/close state for panels and coordinates between components.
 */
export default function CommunityInquiryWrapper({
  communityName,
  communityId,
  communityImage,
  careTypes,
  overallRating,
  sourceSlug,
  citySlug,
}: CommunityInquiryWrapperProps) {
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [advisorOpen, setAdvisorOpen] = useState(false);

  return (
    <>
      {/* Inline CTA Buttons -- rendered in the bento grid via a portal-like pattern */}
      {/* These are exported for use directly in the page */}

      {/* Floating Chat Bubble */}
      <FloatingInquiryButton
        onClick={() => setInquiryOpen(true)}
        hidden={inquiryOpen || advisorOpen}
      />

      {/* Inquiry Slide-Over Panel */}
      <InquiryPanel
        open={inquiryOpen}
        onOpenChange={setInquiryOpen}
        communityName={communityName}
        communityId={communityId}
        communityImage={communityImage}
        careTypes={careTypes}
        overallRating={overallRating}
        sourceSlug={sourceSlug}
      />

      {/* Advisor Slide-Over */}
      <AdvisorSlideOver
        open={advisorOpen}
        onOpenChange={setAdvisorOpen}
        communityName={communityName}
        communityId={communityId}
        sourceSlug={citySlug || sourceSlug}
      />

      {/* Exit Intent Prompt */}
      <ExitIntentPrompt
        communityName={communityName}
        communityId={communityId}
        sourceSlug={sourceSlug}
        disabled={inquiryOpen || advisorOpen}
      />
    </>
  );
}

/**
 * Inline CTA card for the bento grid -- "Ask a Question" card
 */
export function InquiryBentoCard({
  communityName,
  onAskQuestion,
  onTalkToAdvisor,
}: {
  communityName: string;
  onAskQuestion: () => void;
  onTalkToAdvisor: () => void;
}) {
  return (
    <div
      className="rounded-2xl p-6 border bg-gradient-to-br from-teal-50 to-white"
      style={{ borderColor: 'rgba(141, 163, 153, 0.3)' }}
    >
      <div className="flex items-start gap-3 mb-4">
        <div
          className="p-2.5 rounded-xl shrink-0"
          style={{ backgroundColor: 'rgba(141, 163, 153, 0.2)' }}
        >
          <MessageCircle className="h-5 w-5" style={{ color: '#5a7d6a' }} />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-1">Have Questions?</h3>
          <p className="text-sm text-slate-500">
            Ask about {communityName} — we respond within 24 hours
          </p>
        </div>
      </div>

      <div className="space-y-2.5">
        <Button
          onClick={onAskQuestion}
          className="w-full font-semibold bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800"
        >
          <MessageCircle className="h-4 w-4 mr-2" />
          Ask a Question
        </Button>
        <Button
          onClick={onTalkToAdvisor}
          variant="outline"
          className="w-full font-medium border-slate-200 text-slate-700 hover:bg-slate-50"
        >
          <Users className="h-4 w-4 mr-2" />
          Talk to an Advisor
        </Button>
      </div>
    </div>
  );
}
