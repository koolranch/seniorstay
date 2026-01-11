'use client';

import React, { useState } from 'react';
import { 
  Search, Clock, MessageCircle, ArrowRight, 
  CheckCircle, Phone, X, User, Mail 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { submitLead } from '@/app/actions/leads';

interface CareNeedsQuizProps {
  communityName: string;
  cityName: string;
  className?: string;
}

type IntentLevel = 'just_starting' | 'move_30_days' | 'expert_advice';

interface IntentOption {
  id: IntentLevel;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  urgencyScore: number;
  moveInTimeline: string;
}

const INTENT_OPTIONS: IntentOption[] = [
  {
    id: 'just_starting',
    icon: <Search className="h-6 w-6" />,
    title: 'Just Starting',
    subtitle: 'Exploring options for the future',
    urgencyScore: 1,
    moveInTimeline: 'Just researching',
  },
  {
    id: 'move_30_days',
    icon: <Clock className="h-6 w-6" />,
    title: 'Move within 30 Days',
    subtitle: 'Need placement soon',
    urgencyScore: 3,
    moveInTimeline: 'Immediate',
  },
  {
    id: 'expert_advice',
    icon: <MessageCircle className="h-6 w-6" />,
    title: 'Expert Advice Needed',
    subtitle: 'Speak with a specialist now',
    urgencyScore: 2,
    moveInTimeline: '1-3 months',
  },
];

/**
 * CareNeedsQuiz - High-intent lead capture with 3 urgency buttons
 * 
 * Replaces traditional contact forms with intent-based segmentation
 * Navy/Sage glassmorphism theme
 */
export default function CareNeedsQuiz({ 
  communityName, 
  cityName,
  className = ''
}: CareNeedsQuizProps) {
  const [selectedIntent, setSelectedIntent] = useState<IntentLevel | null>(null);
  const [step, setStep] = useState<'select' | 'form' | 'success'>('select');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
  });

  const handleIntentSelect = (intent: IntentLevel) => {
    setSelectedIntent(intent);
    
    // For "Move within 30 Days" - show phone number immediately
    if (intent === 'move_30_days') {
      setStep('form');
    } else {
      setStep('form');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIntent || isSubmitting) return;

    setIsSubmitting(true);
    
    const selectedOption = INTENT_OPTIONS.find(o => o.id === selectedIntent);
    
    try {
      await submitLead({
        fullName: formData.name,
        email: formData.email,
        phone: formData.phone,
        communityName,
        cityOrZip: cityName,
        moveInTimeline: selectedOption?.moveInTimeline as any || '',
        notes: `Care Needs Quiz: ${selectedOption?.title} - ${selectedOption?.subtitle}`,
        pageType: 'community_page',
        sourceSlug: `care-quiz-${selectedIntent}`,
      });
      
      setStep('success');
    } catch (error) {
      console.error('Error submitting lead:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSelectedIntent(null);
    setStep('select');
    setFormData({ name: '', phone: '', email: '' });
  };

  return (
    <div 
      className={`rounded-2xl overflow-hidden border ${className}`}
      style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        borderColor: 'rgba(141, 163, 153, 0.3)',
      }}
    >
      {/* Header */}
      <div className="px-6 py-5 border-b border-white/10">
        <h3 className="text-lg font-semibold text-white">
          What Best Describes Your Situation?
        </h3>
        <p className="text-slate-400 text-sm mt-1">
          Get personalized guidance for {communityName}
        </p>
      </div>

      {/* Content */}
      <div className="p-6">
        {step === 'select' && (
          <div className="space-y-3">
            {INTENT_OPTIONS.map((option) => (
              <button
                key={option.id}
                onClick={() => handleIntentSelect(option.id)}
                className="w-full p-4 rounded-xl border text-left transition-all duration-200 group hover:scale-[1.02]"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderColor: 'rgba(141, 163, 153, 0.2)',
                }}
              >
                <div className="flex items-center gap-4">
                  <div 
                    className="p-3 rounded-xl transition-colors"
                    style={{ 
                      backgroundColor: 'rgba(141, 163, 153, 0.15)',
                      color: '#8DA399'
                    }}
                  >
                    {option.icon}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-white group-hover:text-white/90">
                      {option.title}
                    </p>
                    <p className="text-sm text-slate-400">
                      {option.subtitle}
                    </p>
                  </div>
                  <ArrowRight 
                    className="h-5 w-5 text-slate-500 group-hover:translate-x-1 transition-transform"
                    style={{ color: 'rgba(141, 163, 153, 0.6)' }}
                  />
                </div>
                
                {/* Urgency indicator for "Move within 30 Days" */}
                {option.id === 'move_30_days' && (
                  <div 
                    className="mt-3 px-3 py-1.5 rounded-lg text-xs font-medium inline-flex items-center gap-1.5"
                    style={{ 
                      backgroundColor: 'rgba(239, 68, 68, 0.15)',
                      color: '#fca5a5'
                    }}
                  >
                    <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                    Priority placement support available
                  </div>
                )}
              </button>
            ))}
          </div>
        )}

        {step === 'form' && selectedIntent && (
          <div className="space-y-4">
            {/* Back button */}
            <button
              onClick={handleReset}
              className="text-sm text-slate-400 hover:text-white flex items-center gap-1 mb-2"
            >
              <ArrowRight className="h-3 w-3 rotate-180" />
              Change selection
            </button>
            
            {/* Selected intent badge */}
            <div 
              className="p-3 rounded-xl flex items-center gap-3 mb-4"
              style={{ backgroundColor: 'rgba(141, 163, 153, 0.1)' }}
            >
              <div style={{ color: '#8DA399' }}>
                {INTENT_OPTIONS.find(o => o.id === selectedIntent)?.icon}
              </div>
              <div>
                <p className="font-medium text-white text-sm">
                  {INTENT_OPTIONS.find(o => o.id === selectedIntent)?.title}
                </p>
                <p className="text-xs text-slate-400">
                  {INTENT_OPTIONS.find(o => o.id === selectedIntent)?.subtitle}
                </p>
              </div>
            </div>

            {/* Immediate callback option for urgent */}
            {selectedIntent === 'move_30_days' && (
              <a href="tel:+12166774630" className="block mb-4">
                <Button 
                  className="w-full py-6 text-base font-semibold"
                  style={{ backgroundColor: '#ef4444' }}
                >
                  <Phone className="h-5 w-5 mr-2" />
                  Call Now: (216) 677-4630
                </Button>
                <p className="text-center text-xs text-slate-400 mt-2">
                  Priority line for urgent placements
                </p>
              </a>
            )}

            <div className="relative">
              {selectedIntent === 'move_30_days' && (
                <div className="flex items-center gap-3 text-slate-400 text-sm mb-4">
                  <div className="flex-1 h-px bg-slate-700" />
                  <span>Or leave your details</span>
                  <div className="flex-1 h-px bg-slate-700" />
                </div>
              )}
            </div>

            {/* Contact Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="quiz-name" className="text-slate-300 text-sm">
                  Your Name
                </Label>
                <div className="relative mt-1.5">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <Input
                    id="quiz-name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Full name"
                    className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="quiz-phone" className="text-slate-300 text-sm">
                  Phone Number
                </Label>
                <div className="relative mt-1.5">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <Input
                    id="quiz-phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="(216) 555-0123"
                    className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="quiz-email" className="text-slate-300 text-sm">
                  Email (optional)
                </Label>
                <div className="relative mt-1.5">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <Input
                    id="quiz-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="you@email.com"
                    className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-5 text-base font-semibold text-slate-900"
                style={{ backgroundColor: '#8DA399' }}
              >
                {isSubmitting ? (
                  'Submitting...'
                ) : selectedIntent === 'expert_advice' ? (
                  <>Get Expert Callback</>
                ) : (
                  <>Get Free {cityName} Guide</>
                )}
              </Button>

              <p className="text-xs text-slate-500 text-center">
                Your information is secure. We'll respond within 24 hours.
              </p>
            </form>
          </div>
        )}

        {step === 'success' && (
          <div className="text-center py-6">
            <div 
              className="inline-flex p-4 rounded-full mb-4"
              style={{ backgroundColor: 'rgba(141, 163, 153, 0.2)' }}
            >
              <CheckCircle className="h-10 w-10" style={{ color: '#8DA399' }} />
            </div>
            
            <h4 className="text-xl font-bold text-white mb-2">
              We've Got You!
            </h4>
            
            <p className="text-slate-400 mb-6">
              {selectedIntent === 'move_30_days' 
                ? 'A placement specialist will call you within the hour.'
                : selectedIntent === 'expert_advice'
                  ? 'An expert will reach out within 24 hours.'
                  : `Your ${cityName} senior living guide is on the way.`
              }
            </p>

            <div className="p-4 rounded-xl text-left" style={{ backgroundColor: 'rgba(141, 163, 153, 0.1)' }}>
              <p className="text-sm text-slate-300 mb-2">
                <strong>While you wait:</strong>
              </p>
              <ul className="text-sm text-slate-400 space-y-1">
                <li>• Check your email for our {cityName} cost report</li>
                <li>• Save our number: (216) 677-4630</li>
                <li>• We're available 7 days a week</li>
              </ul>
            </div>

            <button
              onClick={handleReset}
              className="mt-6 text-sm text-slate-400 hover:text-white flex items-center gap-1 mx-auto"
            >
              <X className="h-3 w-3" />
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
