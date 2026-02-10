'use client';

import React, { useState } from 'react';
import InquiryPanel from './InquiryPanel';
import FloatingInquiryButton from './FloatingInquiryButton';
import AdvisorSlideOver from './AdvisorSlideOver';
import ExitIntentPrompt from './ExitIntentPrompt';
import { Button } from '@/components/ui/button';
import { MessageCircle, Users } from 'lucide-react';

interface CommunityInquiryClientProps {
  communityName: string;
  communityId?: string;
  communityImage?: string;
  careTypes?: string[];
  overallRating?: number;
  sourceSlug?: string;
  citySlug?: string;
}

/**
 * All-in-one client component that manages inquiry and advisor panels
 * for the community detail page. Renders both the bento card CTA
 * and the floating/slide-over/exit-intent components.
 */
export default function CommunityInquiryClient({
  communityName,
  communityId,
  communityImage,
  careTypes,
  overallRating,
  sourceSlug,
  citySlug,
}: CommunityInquiryClientProps) {
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [advisorOpen, setAdvisorOpen] = useState(false);

  return (
    <>
      {/* Bento Grid Card -- visible in the layout */}
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
            onClick={() => setInquiryOpen(true)}
            className="w-full font-semibold bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800"
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Ask a Question
          </Button>
          <Button
            onClick={() => setAdvisorOpen(true)}
            variant="outline"
            className="w-full font-medium border-slate-200 text-slate-700 hover:bg-slate-50"
          >
            <Users className="h-4 w-4 mr-2" />
            Talk to an Advisor
          </Button>
        </div>
      </div>

      {/* Floating Chat Bubble */}
      <FloatingInquiryButton
        onClick={() => setInquiryOpen(true)}
        hidden={inquiryOpen || advisorOpen}
      />

      {/* Inquiry Panel */}
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

      {/* Advisor Panel */}
      <AdvisorSlideOver
        open={advisorOpen}
        onOpenChange={setAdvisorOpen}
        communityName={communityName}
        communityId={communityId}
        sourceSlug={citySlug || sourceSlug}
      />

      {/* Exit Intent */}
      <ExitIntentPrompt
        communityName={communityName}
        communityId={communityId}
        sourceSlug={sourceSlug}
        citySlug={citySlug}
        disabled={inquiryOpen || advisorOpen}
      />
    </>
  );
}
