'use client';

import { useState, Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/header/Header';
import Footer from '@/components/footer/Footer';
import { Phone, Mail, MapPin, Clock, Building2, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useLeadSubmit, getUtmParams } from '@/hooks/useLeadSubmit';

// Separate component that uses useSearchParams
function ContactForm() {
  const searchParams = useSearchParams();
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  // Get community info from URL parameters (from sticky CTA)
  const communityName = searchParams.get('community');
  const cityName = searchParams.get('city');
  
  const { submit, isPending, result, isSuccess, isError, reset } = useLeadSubmit();

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
    const utmParams = getUtmParams();
    
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    
    // Determine care type from subject
    const subject = formData.get('subject') as string;
    let careType: string | undefined;
    if (subject === 'Help Finding a Community') {
      careType = 'Assisted Living'; // Default, will be refined by notes
    }
    
    await submit({
      fullName: `${firstName} ${lastName}`.trim(),
      email: formData.get('email') as string,
      phone: formData.get('phone') as string || undefined,
      notes: formData.get('message') as string,
      communityName: communityName || undefined,
      cityOrZip: cityName || undefined,
      careType: careType as any,
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
      <div className="bg-gradient-to-b from-gray-50 to-white py-16">
        <div className="container mx-auto px-4">
          {/* Show context banner if coming from a community page */}
          {communityName && (
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-6 max-w-2xl mx-auto flex items-center gap-3">
              <Building2 className="h-5 w-5 text-primary flex-shrink-0" />
              <p className="text-gray-700">
                <strong>Interested in {communityName}</strong>
                {cityName && ` in ${cityName}`}? Our advisor will help you learn more about this community.
              </p>
            </div>
          )}
          
          <h1 className="text-4xl font-bold text-center mb-4">
            {communityName 
              ? `Speak to a ${cityName || 'Cleveland'} Advisor` 
              : 'Contact Us'}
          </h1>
          <p className="text-xl text-gray-600 text-center max-w-2xl mx-auto">
            {communityName
              ? `Our local advisors know ${communityName} well. Get personalized help with pricing, tours, and availability.`
              : `We're here to help you find the perfect senior living community. 
                 Reach out to our experienced advisors for personalized assistance.`}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Information */}
          <div>
            <h2 className="text-2xl font-semibold mb-6">Get in Touch</h2>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <Phone className="h-6 w-6 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Phone</h3>
                  <p className="text-gray-600">Call us toll-free</p>
                  <a href="tel:+12166774630" className="text-primary hover:underline text-lg font-medium">
                    (216) 677-4630
                  </a>
                  <p className="text-sm text-gray-500 mt-1">Monday - Friday: 8:00 AM - 8:00 PM EST</p>
                  <p className="text-sm text-gray-500">Saturday - Sunday: 9:00 AM - 5:00 PM EST</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Mail className="h-6 w-6 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Email</h3>
                  <p className="text-gray-600">Send us a message</p>
                  <a href="mailto:info@guideforseniors.com" className="text-primary hover:underline">
                    info@guideforseniors.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <MapPin className="h-6 w-6 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Headquarters</h3>
                  <p className="text-gray-600">
                    Guide for Seniors, Inc.<br />
                    United States
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Clock className="h-6 w-6 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Response Time</h3>
                  <p className="text-gray-600">
                    We typically respond to inquiries within 1 business day.
                    For urgent matters, please call us directly.
                  </p>
                </div>
              </div>
            </div>
            
            {/* High Priority Notice */}
            <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <h3 className="font-semibold text-amber-800 mb-2">Need Immediate Help?</h3>
              <p className="text-amber-700 text-sm">
                If you're dealing with a hospital discharge, safety concern, or urgent placement need, 
                please call us directly at <a href="tel:+12166774630" className="font-semibold underline">(216) 677-4630</a> or 
                mention "urgent" in your message for priority response.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-semibold mb-6">Send Us a Message</h2>
            
            {isSuccess ? (
              <div className="bg-green-50 border border-green-200 p-6 rounded-lg">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-green-800">{result?.message}</h3>
                    {result?.priority === 'high' && (
                      <p className="text-green-700 mt-2">
                        Based on your inquiry, a senior advisor will contact you very soon.
                      </p>
                    )}
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
              <form className="space-y-4" onSubmit={handleSubmit}>
                {/* Hidden fields for community context tracking */}
                {communityName && (
                  <>
                    <input type="hidden" name="community_interest" value={communityName} />
                    <input type="hidden" name="city" value={cityName || ''} />
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
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input 
                      id="firstName" 
                      name="firstName" 
                      placeholder="John" 
                      required 
                      className={formErrors.fullName ? 'border-red-500' : ''}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input 
                      id="lastName" 
                      name="lastName" 
                      placeholder="Doe" 
                      required 
                    />
                  </div>
                </div>
                {formErrors.fullName && (
                  <p className="text-red-500 text-sm -mt-2">{formErrors.fullName}</p>
                )}

                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input 
                    id="email" 
                    name="email" 
                    type="email" 
                    placeholder="john@example.com" 
                    required 
                    className={formErrors.email ? 'border-red-500' : ''}
                  />
                  {formErrors.email && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input 
                    id="phone" 
                    name="phone" 
                    type="tel" 
                    placeholder="(216) 677-4630" 
                    className={formErrors.phone ? 'border-red-500' : ''}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Providing your phone helps us respond faster, especially for urgent inquiries.
                  </p>
                  {formErrors.phone && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.phone}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <select 
                    id="subject" 
                    name="subject" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
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
                  <Label htmlFor="message">Message *</Label>
                  <Textarea 
                    id="message" 
                    name="message"
                    placeholder={communityName 
                      ? `I'm interested in learning more about ${communityName}. Please contact me about pricing and availability.`
                      : "How can we help you? Please include any relevant details about your situation."} 
                    rows={5}
                    required 
                    className={formErrors.notes ? 'border-red-500' : ''}
                  />
                  {formErrors.notes && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.notes}</p>
                  )}
                </div>

                <Button type="submit" className="w-full" disabled={isPending}>
                  {isPending ? 'Sending...' : 'Send Message'}
                </Button>
                
                <p className="text-xs text-gray-500 text-center">
                  By submitting, you agree to our{' '}
                  <a href="/privacy-policy" className="underline">Privacy Policy</a>.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// Loading fallback for Suspense
function ContactFormSkeleton() {
  return (
    <>
      <div className="bg-gradient-to-b from-gray-50 to-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-4">Contact Us</h1>
          <p className="text-xl text-gray-600 text-center max-w-2xl mx-auto">
            We're here to help you find the perfect senior living community. 
            Reach out to our experienced advisors for personalized assistance.
          </p>
        </div>
      </div>
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center">
          <div className="animate-pulse text-gray-400">Loading...</div>
        </div>
      </div>
    </>
  );
}

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <Suspense fallback={<ContactFormSkeleton />}>
          <ContactForm />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
