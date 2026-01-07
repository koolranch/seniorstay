"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowRight, AlertCircle, CheckCircle, HelpCircle, Users, Heart } from 'lucide-react';
import Header from '@/components/header/Header';
import Footer from '@/components/footer/Footer';
import StickyTourButton from '@/components/tour/StickyTourButton';
import SimpleContactForm from '@/components/forms/SimpleContactForm';

export default function ChoosingSeniorLivingPage() {
  return (
    <main className="flex min-h-screen flex-col bg-white">
      <Header />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 py-16 border-b">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              How to Choose Senior Living: A Complete Guide
            </h1>
            <p className="text-xl text-gray-700 mb-8">
              Making the right decision for your loved one. Expert guidance on when to transition, what to look for, and how to choose between memory care and assisted living.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            
            <div className="prose prose-lg max-w-none text-gray-700">
              <h2 className="text-3xl font-bold mb-6 text-gray-900">When Is It Time for Senior Living?</h2>
              <p className="mb-6">
                Deciding when to transition to senior living is one of the most important—and difficult—decisions families face. Here are key signs that it may be time:
              </p>

              <div className="bg-red-50 border-l-4 border-red-500 p-6 mb-8 not-prose">
                <div className="flex gap-3">
                  <AlertCircle className="h-6 w-6 text-red-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-lg mb-3 text-gray-900">Safety Warning Signs</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li>• Frequent falls or mobility issues</li>
                      <li>• Forgetting to turn off stove or leaving doors unlocked</li>
                      <li>• Getting lost while driving or walking</li>
                      <li>• Unsafe medication management</li>
                      <li>• Burns, cuts, or unexplained injuries</li>
                      <li>• Fire or safety hazards in the home</li>
                    </ul>
                  </div>
                </div>
              </div>

              <h3 className="text-2xl font-semibold mb-4 mt-8">Daily Living Challenges</h3>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li>Difficulty bathing, dressing, or grooming independently</li>
                <li>Weight loss or poor nutrition due to difficulty cooking</li>
                <li>Declining home maintenance and cleanliness</li>
                <li>Inability to manage finances or pay bills</li>
                <li>Missing medical appointments or not following treatment plans</li>
              </ul>

              <h3 className="text-2xl font-semibold mb-4 mt-8">Social and Emotional Indicators</h3>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li>Increasing isolation and loneliness</li>
                <li>Depression or loss of interest in activities</li>
                <li>Caregiver stress and burnout in family members</li>
                <li>Desire for more social engagement</li>
                <li>Fear of being alone</li>
              </ul>

              <h2 className="text-3xl font-bold mb-6 mt-12 text-gray-900">Memory Care vs. Assisted Living: How to Decide</h2>
              
              <h3 className="text-2xl font-semibold mb-4 mt-6">Choose Memory Care If:</h3>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li>Diagnosed with Alzheimer's, dementia, or significant memory impairment</li>
                <li>Wandering or getting lost frequently</li>
                <li>Needs 24/7 supervision for safety</li>
                <li>Exhibits challenging behaviors related to dementia</li>
                <li>Requires specialized cognitive therapy and programming</li>
                <li>Benefits from secure environment to prevent wandering</li>
              </ul>

              <h3 className="text-2xl font-semibold mb-4 mt-6">Choose Assisted Living If:</h3>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li>Needs help with daily activities but cognitively aware</li>
                <li>Wants to maintain independence with support available</li>
                <li>Socially engaged and enjoys group activities</li>
                <li>Can self-direct and make own decisions</li>
                <li>Needs medication reminders but not intensive management</li>
                <li>Benefits from social engagement and community life</li>
              </ul>

              <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-8 not-prose">
                <p className="text-gray-700">
                  <strong>Important Note:</strong> Many Cleveland communities offer both assisted living and memory care, allowing for transitions as needs change. This "continuum of care" means your loved one can stay in the same community even if care needs increase.
                </p>
              </div>

              <h2 className="text-3xl font-bold mb-6 mt-12 text-gray-900">Essential Questions to Ask During Tours</h2>

              <h3 className="text-2xl font-semibold mb-4 mt-6">About Staffing & Care</h3>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li>What is your staff-to-resident ratio?</li>
                <li>What training do staff members receive?</li>
                <li>Is there an RN on staff? If so, what hours?</li>
                <li>How do you handle medical emergencies?</li>
                <li>Can residents keep their own doctors?</li>
                <li>How often are care plans reviewed and updated?</li>
              </ul>

              <h3 className="text-2xl font-semibold mb-4 mt-6">About Daily Life</h3>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li>What does a typical day look like?</li>
                <li>What activities are offered daily?</li>
                <li>Can residents choose their meal times?</li>
                <li>Is transportation provided for medical appointments?</li>
                <li>What are visiting hours?</li>
                <li>Can residents bring their own furniture?</li>
              </ul>

              <h3 className="text-2xl font-semibold mb-4 mt-6">About Costs & Contracts</h3>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li>What is included in the base rate?</li>
                <li>What costs extra?</li>
                <li>How often do rates increase?</li>
                <li>What is your refund policy?</li>
                <li>Do you accept Medicaid? When?</li>
                <li>Is there a waiting list?</li>
              </ul>

              <h2 className="text-3xl font-bold mb-6 mt-12 text-gray-900">Red Flags to Watch For</h2>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li>Staff seems rushed, unfriendly, or inattentive</li>
                <li>Residents appear unkempt or unhappy</li>
                <li>Unpleasant odors or unsanitary conditions</li>
                <li>Lack of activities or residents sitting idle</li>
                <li>High-pressure sales tactics or rush to sign contract</li>
                <li>Won't let you visit unannounced or speak with residents privately</li>
                <li>Recent citations or violations in state inspection reports</li>
                <li>Vague answers about costs or care capabilities</li>
              </ul>

              <h2 className="text-3xl font-bold mb-6 mt-12 text-gray-900">How to Involve Your Loved One</h2>
              <p className="mb-4">
                When possible, include your loved one in the decision-making process:
              </p>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li><strong>Start Conversations Early:</strong> Discuss options before a crisis makes immediate placement necessary</li>
                <li><strong>Tour Together:</strong> Let them experience communities and express preferences</li>
                <li><strong>Focus on Benefits:</strong> Emphasize social opportunities, activities they'll enjoy, and freedom from home maintenance</li>
                <li><strong>Acknowledge Emotions:</strong> Validate feelings of loss or fear while being honest about safety concerns</li>
                <li><strong>Give Choices:</strong> Let them choose between 2-3 pre-screened options rather than making the decision for them</li>
                <li><strong>Trial Stays:</strong> Some communities offer short-term stays to try before committing</li>
              </ul>

              <h2 className="text-3xl font-bold mb-6 mt-12 text-gray-900">The Tour Checklist</h2>
              <p className="mb-4">
                Plan to tour each community at least twice—once scheduled, once unannounced. Bring this checklist:
              </p>

              <h3 className="text-xl font-semibold mb-3 mt-6">Environment & Safety</h3>
              <ul className="list-disc pl-6 mb-6 space-y-1">
                <li>☐ Clean, well-maintained, and free of odors</li>
                <li>☐ Well-lit hallways and common areas</li>
                <li>☐ Safety features (grab bars, emergency call buttons)</li>
                <li>☐ Secure outdoor areas</li>
                <li>☐ Comfortable temperature</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-6">Staff & Residents</h3>
              <ul className="list-disc pl-6 mb-6 space-y-1">
                <li>☐ Staff are friendly, patient, and attentive</li>
                <li>☐ Residents appear happy and engaged</li>
                <li>☐ Staff know residents by name</li>
                <li>☐ Appropriate staff-to-resident ratio</li>
                <li>☐ Staff respond quickly to resident needs</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-6">Meals & Dining</h3>
              <ul className="list-disc pl-6 mb-6 space-y-1">
                <li>☐ Appetizing, nutritious meals</li>
                <li>☐ Menu variety and special diet accommodations</li>
                <li>☐ Pleasant dining atmosphere</li>
                <li>☐ Flexible meal times</li>
                <li>☐ Residents eating with enjoyment</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-6">Activities & Engagement</h3>
              <ul className="list-disc pl-6 mb-6 space-y-1">
                <li>☐ Diverse activity calendar</li>
                <li>☐ Outings and community events</li>
                <li>☐ Exercise and wellness programs</li>
                <li>☐ Activities matched to residents' interests</li>
                <li>☐ Opportunities for spiritual and cultural activities</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Get Personalized Help Choosing Senior Living</h2>
            <p className="text-lg text-gray-700 mb-8">
              Our Cleveland advisors will help you navigate this important decision. We'll match you with communities that fit your needs, budget, and preferences—completely free.
            </p>
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <SimpleContactForm 
                sourcePage="choosing-senior-living" 
                buttonText="Get Free Consultation"
                showMessage={false}
              />
            </div>
          </div>
        </div>
      </div>

      <StickyTourButton />
      <Footer />
    </main>
  );
}

