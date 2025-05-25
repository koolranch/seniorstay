import Header from '@/components/header/Header';
import Footer from '@/components/footer/Footer';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export const metadata = {
  title: 'Contact Us | Guide for Seniors',
  description: 'Get in touch with Guide for Seniors. We\'re here to help you find the perfect senior living community.',
};

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
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
                    <a href="tel:1888736467" className="text-primary hover:underline text-lg font-medium">
                      1-888-SENIORS (1-888-736-4677)
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
                      123 Main Street<br />
                      Suite 100<br />
                      Cleveland, OH 44114
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
              
              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" placeholder="John" required />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" placeholder="Doe" required />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="john@example.com" required />
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" placeholder="(555) 555-5555" />
                </div>

                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <select id="subject" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary">
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
                    placeholder="How can we help you?" 
                    rows={5}
                    required 
                  />
                </div>

                <Button type="submit" className="w-full">
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
} 