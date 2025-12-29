'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/header/Header';
import Footer from '@/components/footer/Footer';
import { Phone, Mail, MapPin, Clock, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

// Separate component that uses useSearchParams
function ContactForm() {
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  
  // Get community info from URL parameters (from sticky CTA)
  const communityName = searchParams.get('community');
  const cityName = searchParams.get('city');
  
  const formspreeId = "xnnpaply";
  const formspreeEndpoint = `https://formspree.io/f/${formspreeId}`;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    const formData = new FormData(e.currentTarget);
    
    try {
      const response = await fetch(formspreeEndpoint, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        setSubmitMessage('Thank you for your message! We\'ll get back to you soon.');
        e.currentTarget.reset();
      } else {
        setSubmitMessage('Something went wrong. Please try again or call us directly.');
      }
    } catch (error) {
      setSubmitMessage('Something went wrong. Please try again or call us directly.');
    } finally {
      setIsSubmitting(false);
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
          </div>

          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-semibold mb-6">Send Us a Message</h2>
            
            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Hidden fields for community context tracking */}
              {communityName && (
                <>
                  <input type="hidden" name="community_interest" value={communityName} />
                  <input type="hidden" name="city" value={cityName || ''} />
                  <input type="hidden" name="source" value="community_page_cta" />
                </>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" name="firstName" placeholder="John" required />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" name="lastName" placeholder="Doe" required />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="john@example.com" required />
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" name="phone" type="tel" placeholder="(216) 677-4630" />
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
                <Label htmlFor="message">Message</Label>
                <Textarea 
                  id="message" 
                  name="message"
                  placeholder={communityName 
                    ? `I'm interested in learning more about ${communityName}. Please contact me about pricing and availability.`
                    : "How can we help you?"} 
                  rows={5}
                  required 
                />
              </div>

              {submitMessage && (
                <div className={`p-4 rounded-md ${submitMessage.includes('Thank you') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                  {submitMessage}
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
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
