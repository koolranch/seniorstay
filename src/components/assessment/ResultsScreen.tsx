"use client";

import { motion } from 'framer-motion';
import { CheckCircle, RefreshCw, Edit, Phone, Calendar } from 'lucide-react';
import { useAssessmentStore } from '@/store/assessmentStore';
import CommunityMatch from './CommunityMatch';
import LeadCaptureForm from './LeadCaptureForm';
import { Button } from '@/components/ui/button';
import { trackAssessmentCompleted, trackAssessmentRestarted } from '@/components/analytics/AssessmentAnalytics';
import { useEffect } from 'react';

interface ResultsScreenProps {
  onRestart: () => void;
}

export default function ResultsScreen({ onRestart }: ResultsScreenProps) {
  const { recommendation, score, matchedCommunities, answers } = useAssessmentStore();

  // Track assessment completion when results are shown
  useEffect(() => {
    if (recommendation) {
      trackAssessmentCompleted(score, recommendation.title);
    }
  }, [recommendation, score]);

  const handleRestart = () => {
    trackAssessmentRestarted();
    onRestart();
  };

  if (!recommendation) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <p className="text-gray-600">No results available. Please retake the assessment.</p>
        <Button onClick={handleRestart} className="mt-4">
          Restart Assessment
        </Button>
      </div>
    );
  }

  const communityNames = matchedCommunities.map(c => c.name);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl sm:text-4xl font-bold text-[#1e3a5f] mb-2">
          Your Personalized Results
        </h1>
        <p className="text-gray-600">
          Based on your answers, here's what we recommend
        </p>
      </motion.div>

      {/* Recommendation Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-br from-blue-50 to-orange-50 rounded-2xl p-6 sm:p-8 mb-8 border-2 border-[#ff5a5f]"
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1e3a5f] mb-2">
              {recommendation.title}
            </h2>
            <p className="text-lg text-gray-700 mb-4">
              {recommendation.description}
            </p>
          </div>
          <Button
            onClick={handleRestart}
            variant="outline"
            size="sm"
            className="flex-shrink-0"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit Answers
          </Button>
        </div>

        {/* Cost Range */}
        <div className="bg-white rounded-lg p-4 mb-4">
          <p className="text-sm text-gray-600 mb-1">Estimated Cost Range:</p>
          <p className="text-xl font-bold text-[#1e3a5f]">
            {recommendation.costRange}
          </p>
        </div>

        {/* Reasons */}
        <div>
          <p className="font-semibold text-[#1e3a5f] mb-3">
            Why we recommend this:
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {recommendation.reasons.map((reason, index) => (
              <li key={index} className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">{reason}</span>
              </li>
            ))}
          </ul>
        </div>
      </motion.div>

      {/* Matched Communities */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-12"
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-[#1e3a5f] mb-6 text-center">
          Your Top 3 Matched Communities in Cleveland
        </h2>

        {matchedCommunities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matchedCommunities.map((community, index) => (
              <CommunityMatch
                key={community.id}
                community={community}
                recommendation={recommendation.recommendation}
                answers={answers}
                index={index}
              />
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 rounded-xl p-8 text-center">
            <p className="text-gray-600 mb-4">
              We're still building our database. Contact us to discuss available communities.
            </p>
            <Button className="bg-[#ff5a5f] hover:bg-[#ff4449]">
              Contact Us
            </Button>
          </div>
        )}
      </motion.div>

      {/* Lead Capture Form */}
      <LeadCaptureForm
        assessmentData={{
          score,
          recommendation: recommendation.title,
          matchedCommunities: communityNames,
          answers,
        }}
      />

      {/* Next Steps Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-12 bg-white rounded-xl shadow-md p-6 sm:p-8"
      >
        <h3 className="text-2xl font-bold text-[#1e3a5f] mb-6 text-center">
          What Happens Next?
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-3">
              <Phone className="w-6 h-6 text-blue-600" />
            </div>
            <h4 className="font-semibold text-[#1e3a5f] mb-2">1. We'll Call You</h4>
            <p className="text-sm text-gray-600">
              A senior living advisor will contact you within 24 hours
            </p>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-3">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
            <h4 className="font-semibold text-[#1e3a5f] mb-2">2. Schedule Tours</h4>
            <p className="text-sm text-gray-600">
              We'll help arrange visits to your matched communities
            </p>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 rounded-full mb-3">
              <CheckCircle className="w-6 h-6 text-[#ff5a5f]" />
            </div>
            <h4 className="font-semibold text-[#1e3a5f] mb-2">3. Find the Right Fit</h4>
            <p className="text-sm text-gray-600">
              We'll support you through the entire decision process
            </p>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 text-center">
          <p className="text-gray-700 mb-4">
            <strong>Need immediate assistance?</strong>
          </p>
          <a
            href="tel:+12166774630"
            className="inline-flex items-center text-[#ff5a5f] font-semibold hover:underline"
          >
            <Phone className="w-5 h-5 mr-2" />
            Call us now: (216) 677-4630
          </a>
        </div>
      </motion.div>

      {/* Restart Option */}
      <div className="mt-8 text-center">
        <Button
          onClick={handleRestart}
          variant="outline"
          size="lg"
          className="border-[#1e3a5f] text-[#1e3a5f] hover:bg-[#1e3a5f] hover:text-white"
        >
          <RefreshCw className="w-5 h-5 mr-2" />
          Retake Assessment
        </Button>
      </div>
    </div>
  );
}

