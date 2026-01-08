"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Loader2, Mail, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { trackLeadFormSubmitted } from '@/components/analytics/AssessmentAnalytics';
import { submitLead } from '@/app/actions/leads';

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
  const [submittedEmail, setSubmittedEmail] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Map recommendation to care type
  const recommendationToCareType = (rec: string): string => {
    if (rec.toLowerCase().includes('memory')) return 'Memory Care';
    if (rec.toLowerCase().includes('assisted')) return 'Assisted Living';
    if (rec.toLowerCase().includes('independent')) return 'Independent Living';
    if (rec.toLowerCase().includes('skilled')) return 'Skilled Nursing';
    return 'Not Sure';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Step 1: Submit lead to database
      const result = await submitLead({
        fullName: formData.name,
        email: formData.email,
        phone: formData.phone,
        careType: recommendationToCareType(assessmentData.recommendation) as any,
        notes: `Assessment Results: ${assessmentData.recommendation}. Score: ${assessmentData.score}. Matched Communities: ${assessmentData.matchedCommunities.join(', ')}. ${formData.message ? `Additional comments: ${formData.message}` : ''}`,
        communityName: assessmentData.matchedCommunities[0] || '',
        pageType: 'assessment',
        sourceSlug: 'care-assessment',
      });

      if (result.success) {
        // Step 2: Send personalized PDF care guide via email
        try {
          const pdfResponse = await fetch('/api/send-care-guide', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              recipientName: formData.name,
              email: formData.email,
              assessmentData: assessmentData,
            }),
          });
          
          const pdfResult = await pdfResponse.json();
          if (!pdfResult.success) {
            console.warn('[LeadCaptureForm] PDF email may not have been sent:', pdfResult.error);
            // Don't fail the whole submission if PDF fails - lead was already captured
          }
        } catch (pdfError) {
          console.error('[LeadCaptureForm] Error sending PDF:', pdfError);
          // Continue anyway - the lead was captured successfully
        }

        // Mark as success and store email for display
        setSubmittedEmail(formData.email);
        setIsSuccess(true);
        setFormData({ name: '', email: '', phone: '', message: '' });
        
        // Track successful form submission
        trackLeadFormSubmitted(assessmentData.recommendation, assessmentData.matchedCommunities);
      } else {
        throw new Error(result.message || 'Submission failed');
      }
    } catch (err) {
      console.error('[LeadCaptureForm] Submission error:', err);
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
        className="bg-gradient-to-br from-green-50 to-teal-50 border-2 border-green-500 rounded-xl p-8 text-center"
      >
        <div className="flex justify-center gap-2 mb-4">
          <CheckCircle className="w-12 h-12 text-green-600" />
          <Mail className="w-12 h-12 text-teal-600" />
        </div>
        
        <h3 className="text-2xl font-bold text-green-800 mb-2">
          Your Care Guide is On Its Way!
        </h3>
        
        <div className="bg-white rounded-lg p-4 mb-4 inline-block">
          <div className="flex items-center justify-center gap-2 text-teal-700">
            <FileText className="w-5 h-5" />
            <span className="font-medium">Check your email at</span>
          </div>
          <p className="text-lg font-bold text-teal-800 mt-1">{submittedEmail}</p>
        </div>
        
        <p className="text-green-700 mb-4">
          Your personalized care guide PDF is attached to our email. It includes:
        </p>
        
        <ul className="text-left text-green-600 mb-6 max-w-sm mx-auto space-y-2">
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 mt-1 flex-shrink-0" />
            <span>Your care type recommendation</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 mt-1 flex-shrink-0" />
            <span>Cleveland area pricing guide</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 mt-1 flex-shrink-0" />
            <span>Matched communities list</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 mt-1 flex-shrink-0" />
            <span>Tour preparation checklist</span>
          </li>
        </ul>
        
        <div className="bg-teal-100 rounded-lg p-4">
          <p className="text-teal-800 font-medium mb-2">
            Ready to Schedule Tours?
          </p>
          <a 
            href="tel:+12166774630" 
            className="inline-flex items-center gap-2 bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors"
          >
            Call (216) 677-4630
          </a>
          <p className="text-sm text-teal-600 mt-2">
            Free guidance from local Cleveland advisors
          </p>
        </div>
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
            placeholder="(216) 677-4630"
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
              Preparing Your Guide...
            </>
          ) : (
            <>
              <FileText className="w-5 h-5 mr-2" />
              Get My Personalized Guide
            </>
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

