"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { trackLeadFormSubmitted } from '@/components/analytics/AssessmentAnalytics';

interface LeadCaptureFormProps {
  assessmentData: {
    score: number;
    recommendation: string;
    matchedCommunities: string[];
    answers: Record<string, string | string[]>;
  };
}

export default function LeadCaptureForm({ assessmentData }: LeadCaptureFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('https://formspree.io/f/xnnpaply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          assessment_score: assessmentData.score,
          recommendation_type: assessmentData.recommendation,
          matched_communities: assessmentData.matchedCommunities.join(', '),
          assessment_answers: JSON.stringify(assessmentData.answers),
          form_type: 'care_assessment',
          timestamp: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        setIsSuccess(true);
        setFormData({ name: '', email: '', phone: '', message: '' });
        // Track successful form submission
        trackLeadFormSubmitted(assessmentData.recommendation, assessmentData.matchedCommunities);
      } else {
        throw new Error('Submission failed');
      }
    } catch (err) {
      setError('Failed to submit form. Please try again or call us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-green-50 border-2 border-green-500 rounded-xl p-8 text-center"
      >
        <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-green-800 mb-2">
          Thank You!
        </h3>
        <p className="text-green-700 mb-4">
          We've received your information and will contact you within 24 hours with your personalized care guide.
        </p>
        <p className="text-sm text-green-600">
          Need immediate assistance? Call us at <strong>(216) 555-0100</strong>
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-gradient-to-br from-[#1e3a5f] to-[#2d4a6f] rounded-xl p-8"
    >
      <div className="text-center mb-6">
        <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">
          Get Your FREE Personalized Care Guide
        </h3>
        <p className="text-gray-200">
          We'll send detailed information on these communities, pricing, availability, and next steps
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <Label htmlFor="name" className="text-white mb-2 block">
            Full Name *
          </Label>
          <Input
            id="name"
            name="name"
            type="text"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder="John Smith"
            className="bg-white"
          />
        </div>

        {/* Email */}
        <div>
          <Label htmlFor="email" className="text-white mb-2 block">
            Email Address *
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="john@example.com"
            className="bg-white"
          />
        </div>

        {/* Phone */}
        <div>
          <Label htmlFor="phone" className="text-white mb-2 block">
            Phone Number *
          </Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            required
            value={formData.phone}
            onChange={handleChange}
            placeholder="(216) 555-0100"
            className="bg-white"
          />
        </div>

        {/* Message (Optional) */}
        <div>
          <Label htmlFor="message" className="text-white mb-2 block">
            Additional Comments (Optional)
          </Label>
          <Textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Any specific questions or requirements?"
            rows={3}
            className="bg-white"
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isSubmitting}
          size="lg"
          className="w-full bg-[#ff5a5f] hover:bg-[#ff4449] text-white font-semibold py-6 text-lg"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Sending...
            </>
          ) : (
            'Send My Care Guide'
          )}
        </Button>

        {/* Privacy Note */}
        <p className="text-xs text-gray-300 text-center">
          By submitting this form, you agree to our{' '}
          <a href="/privacy-policy" className="underline hover:text-white">
            Privacy Policy
          </a>
          . We respect your privacy and will never share your information.
        </p>
      </form>
    </motion.div>
  );
}

