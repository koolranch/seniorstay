'use client';

import { useState, Suspense, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import GlobalHeader from '@/components/home/GlobalHeader';
import Footer from '@/components/footer/Footer';
import { Phone, Mail, MapPin, Clock, Building2, CheckCircle2, AlertCircle, Users, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useLeadSubmit, getUtmParams } from '@/hooks/useLeadSubmit';
import { trackFormStart } from '@/components/analytics/GoogleAnalytics';
import PhoneLink from '@/components/conversion/PhoneLink';
import { PLACEMENT_CALLBACK_MESSAGE, PLACEMENT_PHONE_DISPLAY } from '@/lib/placement-contact';
import { isValidPhone, MOVE_IN_TIMELINE_OPTIONS } from '@/lib/lead-form-options';

// Separate component that uses useSearchParams
function ContactForm() {
  const searchParams = useSearchParams();
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  // Get community info from URL parameters (from sticky CTA)
  const communityName = searchParams.get('community');
  const cityName = searchParams.get('city');
  
  const { submit, isPending, result, isSuccess, isError, reset } = useLeadSubmit();
  const formStartTrackedRef = useRef(false);

  const trackStartOnce = () => {
    if (!formStartTrackedRef.current) {
      formStartTrackedRef.current = true;
      trackFormStart('contact');
    }
  };

  // Reset errors when result changes
  useEffect(() => {
    if (result?.errors) {
      const errors: Record<string, string> = {};
      Object.entries(result.errors).forEach(([field, messages]) => {
        errors[field] = messages[0];
      });
      setFormErrors(errors);
    } else {
      setFormErrors({});
    }
  }, [result]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormErrors({});

    const formData = new FormData(e.currentTarget);
    const phone = (formData.get('phone') as string) || '';

    if (!isValidPhone(phone)) {
      setFormErrors({ phone: 'A valid phone number is required so we can call you back.' });
      return;
    }

    const utmParams = getUtmParams();

    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;

    const subject = formData.get('subject') as string;
    let careType: string | undefined;
    if (subject === 'Help Finding a Community') {
      careType = 'Assisted Living';
    }

    await submit({
      fullName: `${firstName} ${lastName}`.trim(),
      email: formData.get('email') as string,
      phone,
      moveInTimeline: (formData.get('moveInTimeline') as string) || undefined,
      notes: formData.get('message') as string,
      communityName: communityName || undefined,
      cityOrZip: cityName || undefined,
      careType,
      pageType: 'contact',
      sourceSlug: cityName?.toLowerCase().replace(/\s+/g, '-'),
      ...utmParams,
    });
    
    // Reset form on success
    if (result?.success) {
      e.currentTarget.reset();
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-slate-50 via-white to-slate-50 py-16 md:py-20 relative overflow-hidden">
        <div className="absolute top-20 right-10 w-72 h-72 bg-teal-200/20 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 relative z-10">
          {/* Context banner from city or community */}
          {(communityName || cityName) && (
            <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 mb-8 max-w-2xl mx-auto flex items-center gap-3">
              <Building2 className="h-5 w-5 text-teal-600 flex-shrink-0" />
              <p className="text-slate-700">
                {communityName ? (
                  <>
                    <strong>Interested in {communityName}</strong>
                    {cityName && ` in ${cityName}`}? Our advisor will help you learn more about this community.
                  </>
                ) : (
                  <>
                    <strong>Looking for senior living in {cityName}?</strong> A local advisor will call you back—often within 2 hours on business days.
                  </>
                )}
              </p>
            </div>
          )}
          
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-block bg-teal-100 text-teal-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              Free Expert Guidance
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              {communityName
                ? `Speak to a ${cityName || 'Cleveland'} Advisor`
                : cityName
                  ? `Speak to a ${cityName} Advisor`
                  : 'Contact Us'}
            </h1>
            <p className="text-lg md:text-xl text-slate-600">
              {communityName
                ? `Our local advisors know ${communityName} well. Get personalized help with pricing, tours, and availability.`
                : cityName
                  ? `Get free help comparing senior living in ${cityName}. We'll call you back—often within 2 hours on business days.`
                  : `We're here to help you find the perfect senior living community. 
                   Reach out to our experienced advisors for personalized assistance.`}
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Information */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-8">Get in Touch</h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4 bg-slate-50 rounded-xl p-5">
                  <div className="bg-teal-100 p-3 rounded-lg">
                    <Phone className="h-6 w-6 text-teal-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1">Phone</h3>
                    <p className="text-slate-600 text-sm mb-2">Call us toll-free</p>
                    <PhoneLink placement="contact_sidebar" className="text-teal-600 hover:text-teal-700 text-xl font-bold">
                      {PLACEMENT_PHONE_DISPLAY}
                    </PhoneLink>
                    <p className="text-sm text-slate-500 mt-2">Most families hear back within 2 hours on business days.</p>
                    <p className="text-sm text-slate-500">Monday - Friday: 8:00 AM - 8:00 PM EST</p>
                    <p className="text-sm text-slate-500">Saturday - Sunday: 9:00 AM - 5:00 PM EST</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 bg-slate-50 rounded-xl p-5">
                  <div className="bg-teal-100 p-3 rounded-lg">
                    <Mail className="h-6 w-6 text-teal-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1">Email</h3>
                    <p className="text-slate-600 text-sm mb-2">Send us a message</p>
                    <a href="mailto:info@guideforseniors.com" className="text-teal-600 hover:text-teal-700 font-semibold">
                      info@guideforseniors.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 bg-slate-50 rounded-xl p-5">
                  <div className="bg-teal-100 p-3 rounded-lg">
                    <Clock className="h-6 w-6 text-teal-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1">Response Time</h3>
                    <p className="text-slate-600">
                      {PLACEMENT_CALLBACK_MESSAGE}
                      For urgent matters, please call us directly.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* High Priority Notice */}
              <div className="mt-8 p-5 bg-amber-50 border-2 border-amber-200 rounded-xl">
                <h3 className="font-bold text-amber-800 mb-2 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Need Immediate Help?
                </h3>
                <p className="text-amber-700 text-sm">
                  If you're dealing with a hospital discharge, safety concern, or urgent placement need, 
                  please call us directly at <a href="tel:+12166774630" className="font-bold underline">(216) 677-4630</a> or 
                  mention "urgent" in your message for priority response.
                </p>
              </div>

              {/* Trust badges */}
              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-xl p-4 text-center">
                  <Shield className="h-8 w-8 text-teal-600 mx-auto mb-2" />
                  <p className="font-semibold text-slate-900">100% Free</p>
                  <p className="text-xs text-slate-500">No cost to families</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-4 text-center">
                  <Users className="h-8 w-8 text-teal-600 mx-auto mb-2" />
                  <p className="font-semibold text-slate-900">Local Experts</p>
                  <p className="text-xs text-slate-500">Cleveland advisors</p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white border-2 border-slate-200 rounded-2xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Send Us a Message</h2>
              
              {isSuccess ? (
                <div className="bg-green-50 border-2 border-green-200 p-6 rounded-xl">
                  <div className="flex items-start gap-3">
                    <div className="bg-green-100 p-2 rounded-full">
                      <CheckCircle2 className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-green-800 text-lg">Thank you!</h3>
                      <p className="text-green-700 mt-2">{PLACEMENT_CALLBACK_MESSAGE}</p>
                      <p className="text-green-700 mt-2 text-sm">
                        Or call{' '}
                        <PhoneLink placement="contact_success" className="font-semibold underline">
                          {PLACEMENT_PHONE_DISPLAY}
                        </PhoneLink>
                      </p>
                      <Button 
                        onClick={() => reset()} 
                        variant="outline" 
                        className="mt-4"
                      >
                        Send Another Message
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <form className="space-y-5" onSubmit={handleSubmit} onFocus={trackStartOnce}>
                  {/* Hidden fields for community context tracking */}
                  {(communityName || cityName) && (
                    <>
                      {communityName && <input type="hidden" name="community_interest" value={communityName} />}
                      {cityName && <input type="hidden" name="city" value={cityName} />}
                    </>
                  )}
                  
                  {/* Error Banner */}
                  {isError && (
                    <div className="bg-red-50 border border-red-200 p-4 rounded-lg flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-red-800 font-medium">{result?.message}</p>
                        <p className="text-red-700 text-sm mt-1">
                          You can also call us directly at (216) 677-4630.
                        </p>
                      </div>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName" className="font-semibold text-slate-700">First Name *</Label>
                      <Input 
                        id="firstName" 
                        name="firstName" 
                        placeholder="John" 
                        required 
                        className={`mt-1.5 h-12 ${formErrors.fullName ? 'border-red-500' : 'border-slate-300'}`}
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName" className="font-semibold text-slate-700">Last Name *</Label>
                      <Input 
                        id="lastName" 
                        name="lastName" 
                        placeholder="Doe" 
                        required 
                        className="mt-1.5 h-12 border-slate-300"
                      />
                    </div>
                  </div>
                  {formErrors.fullName && (
                    <p className="text-red-500 text-sm -mt-3">{formErrors.fullName}</p>
                  )}

                  <div>
                    <Label htmlFor="email" className="font-semibold text-slate-700">Email *</Label>
                    <Input 
                      id="email" 
                      name="email" 
                      type="email" 
                      placeholder="john@example.com" 
                      required 
                      className={`mt-1.5 h-12 ${formErrors.email ? 'border-red-500' : 'border-slate-300'}`}
                    />
                    {formErrors.email && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="phone" className="font-semibold text-slate-700">Phone Number *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      placeholder="(216) 677-4630"
                      onFocus={trackStartOnce}
                      className={`mt-1.5 h-12 ${formErrors.phone ? 'border-red-500' : 'border-slate-300'}`}
                    />
                    <p className="text-xs text-slate-500 mt-1.5">
                      We call you back—often within 15 minutes during business hours.
                    </p>
                    {formErrors.phone && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.phone}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="moveInTimeline" className="font-semibold text-slate-700">
                      When are you looking to move? *
                    </Label>
                    <select
                      id="moveInTimeline"
                      name="moveInTimeline"
                      required
                      defaultValue=""
                      onFocus={trackStartOnce}
                      className="w-full mt-1.5 h-12 px-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="" disabled>
                        Select a timeline
                      </option>
                      {MOVE_IN_TIMELINE_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="subject" className="font-semibold text-slate-700">Subject</Label>
                    <select 
                      id="subject" 
                      name="subject" 
                      className="w-full mt-1.5 h-12 px-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      defaultValue={communityName ? 'Help Finding a Community' : 'General Inquiry'}
                    >
                      <option>General Inquiry</option>
                      <option>Help Finding a Community</option>
                      <option>Financial Assistance Questions</option>
                      <option>Partner with Us</option>
                      <option>Technical Support</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="message" className="font-semibold text-slate-700">Message *</Label>
                    <Textarea 
                      id="message" 
                      name="message"
                      placeholder={communityName 
                        ? `I'm interested in learning more about ${communityName}. Please contact me about pricing and availability.`
                        : "How can we help you? Please include any relevant details about your situation."} 
                      rows={5}
                      required 
                      className={`mt-1.5 ${formErrors.notes ? 'border-red-500' : 'border-slate-300'}`}
                    />
                    {formErrors.notes && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.notes}</p>
                    )}
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-14 text-lg font-bold bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800" 
                    disabled={isPending}
                  >
                    {isPending ? 'Sending...' : 'Send Message'}
                  </Button>
                  
                  <p className="text-xs text-slate-500 text-center">
                    By submitting, you agree to our{' '}
                    <a href="/privacy-policy" className="underline hover:text-teal-600">Privacy Policy</a>.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

// Loading fallback for Suspense
function ContactFormSkeleton() {
  return (
    <>
      <section className="bg-gradient-to-b from-slate-50 via-white to-slate-50 py-16 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Contact Us</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            We're here to help you find the perfect senior living community. 
            Reach out to our experienced advisors for personalized assistance.
          </p>
        </div>
      </section>
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center">
          <div className="animate-pulse text-slate-400">Loading...</div>
        </div>
      </div>
    </>
  );
}

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <GlobalHeader />
      
      <main className="flex-grow">
        <Suspense fallback={<ContactFormSkeleton />}>
          <ContactForm />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
