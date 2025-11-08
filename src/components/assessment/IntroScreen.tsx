"use client";

import { motion } from 'framer-motion';
import { CheckCircle, Clock, Heart, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { trackAssessmentStarted } from '@/components/analytics/AssessmentAnalytics';

interface IntroScreenProps {
  onStart: () => void;
}

export default function IntroScreen({ onStart }: IntroScreenProps) {
  const handleStart = () => {
    trackAssessmentStarted();
    onStart();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
    >
      <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-12">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#1e3a5f] mb-4">
            Find Your Ideal Care Level in 2 Minutes
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Answer 8 simple questions and we'll recommend the perfect senior living communities 
            for your loved one's needs in Greater Cleveland.
          </p>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 rounded-full mb-3">
              <Clock className="w-6 h-6 text-[#ff5a5f]" />
            </div>
            <h3 className="font-semibold text-[#1e3a5f] mb-1">Quick & Easy</h3>
            <p className="text-sm text-gray-600">Takes just 2 minutes</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 rounded-full mb-3">
              <Heart className="w-6 h-6 text-[#ff5a5f]" />
            </div>
            <h3 className="font-semibold text-[#1e3a5f] mb-1">Personalized</h3>
            <p className="text-sm text-gray-600">Tailored to your needs</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 rounded-full mb-3">
              <CheckCircle className="w-6 h-6 text-[#ff5a5f]" />
            </div>
            <h3 className="font-semibold text-[#1e3a5f] mb-1">100% Free</h3>
            <p className="text-sm text-gray-600">No cost, no commitment</p>
          </motion.div>
        </div>

        {/* What You'll Get */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-gray-50 rounded-xl p-6 mb-8"
        >
          <h3 className="text-lg font-semibold text-[#1e3a5f] mb-4 flex items-center">
            <Users className="w-5 h-5 mr-2 text-[#ff5a5f]" />
            What You'll Get:
          </h3>
          <ul className="space-y-3">
            <li className="flex items-start">
              <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">
                <strong>Care Level Recommendation:</strong> Memory Care, Assisted Living, or Both
              </span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">
                <strong>3 Matched Communities:</strong> Personalized suggestions based on your answers
              </span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">
                <strong>Cost Estimates:</strong> Expected pricing for your recommended care level
              </span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">
                <strong>Expert Guidance:</strong> Free personalized care guide sent to your email
              </span>
            </li>
          </ul>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center"
        >
          <Button
            onClick={handleStart}
            size="lg"
            className="bg-[#ff5a5f] hover:bg-[#ff4449] text-white px-12 py-6 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
          >
            Start Assessment
          </Button>
          <p className="text-sm text-gray-500 mt-4">
            8 questions • Designed by senior care experts
          </p>
        </motion.div>

        {/* Trust Badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center mt-8 pt-8 border-t border-gray-200"
        >
          <p className="text-sm text-gray-600">
            <strong className="text-[#1e3a5f]">Trusted by families across Cleveland</strong>
            <br />
            Helping connect seniors with 100+ quality communities in Greater Cleveland
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}

