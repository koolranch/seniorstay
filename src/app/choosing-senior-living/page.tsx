"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowRight, AlertTriangle, CheckCircle, HelpCircle, Users, Heart, Phone, Brain, Shield, Eye, Utensils, Calendar, ClipboardCheck } from 'lucide-react';
import GlobalHeader from '@/components/home/GlobalHeader';
import Footer from '@/components/footer/Footer';
import StickyTourButton from '@/components/tour/StickyTourButton';
import SimpleContactForm from '@/components/forms/SimpleContactForm';

export default function ChoosingSeniorLivingPage() {
  return (
    <main className="flex min-h-screen flex-col bg-white">
      <GlobalHeader />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-slate-50 via-white to-slate-50 py-16 md:py-24 relative overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-amber-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-200/20 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-block bg-amber-100 text-amber-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <ClipboardCheck className="inline h-4 w-4 mr-1" />
              Expert Guidance
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900 leading-tight">
              How to Choose Senior Living: A Complete Guide
            </h1>
            <p className="text-lg md:text-xl text-slate-600">
              Making the right decision for your loved one. Expert guidance on when to transition, what to look for, and how to choose between memory care and assisted living.
            </p>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="bg-slate-800 py-4 text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm md:text-base">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-amber-400" />
              <span>500+ Families Helped</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-amber-400" />
              <span>100% Free Service</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-amber-400" />
              <span>Compassionate Guidance</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            
            {/* When Is It Time */}
            <div className="mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-900">When Is It Time for Senior Living?</h2>
              <p className="text-lg text-slate-600 mb-8">
                Deciding when to transition to senior living is one of the most important—and difficult—decisions families face. Here are key signs that it may be time:
              </p>

              {/* Safety Warning Signs */}
              <div className="bg-red-50 border border-red-200 rounded-2xl p-8 mb-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="bg-red-100 p-3 rounded-xl">
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">Safety Warning Signs</h3>
                </div>
                <ul className="grid md:grid-cols-2 gap-3">
                  {[
                    "Frequent falls or mobility issues",
                    "Forgetting to turn off stove or leaving doors unlocked",
                    "Getting lost while driving or walking",
                    "Unsafe medication management",
                    "Burns, cuts, or unexplained injuries",
                    "Fire or safety hazards in the home"
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-2 text-slate-700">
                      <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Daily Living Challenges */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-4 text-slate-900">Daily Living Challenges</h3>
                <div className="space-y-3">
                  {[
                    "Difficulty bathing, dressing, or grooming independently",
                    "Weight loss or poor nutrition due to difficulty cooking",
                    "Declining home maintenance and cleanliness",
                    "Inability to manage finances or pay bills",
                    "Missing medical appointments or not following treatment plans"
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-3 bg-slate-50 p-4 rounded-xl">
                      <CheckCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Social and Emotional */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-4 text-slate-900">Social and Emotional Indicators</h3>
                <div className="space-y-3">
                  {[
                    "Increasing isolation and loneliness",
                    "Depression or loss of interest in activities",
                    "Caregiver stress and burnout in family members",
                    "Desire for more social engagement",
                    "Fear of being alone"
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-3 bg-slate-50 p-4 rounded-xl">
                      <Heart className="h-5 w-5 text-rose-500 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Memory Care vs Assisted Living */}
            <div className="mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-slate-900">Memory Care vs. Assisted Living: How to Decide</h2>
              
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {/* Memory Care */}
                <div className="bg-violet-50 border border-violet-200 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-violet-100 w-12 h-12 rounded-xl flex items-center justify-center">
                      <Brain className="h-6 w-6 text-violet-600" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">Choose Memory Care If:</h3>
                  </div>
                  <ul className="space-y-2">
                    {[
                      "Diagnosed with Alzheimer's, dementia, or significant memory impairment",
                      "Wandering or getting lost frequently",
                      "Needs 24/7 supervision for safety",
                      "Exhibits challenging behaviors related to dementia",
                      "Requires specialized cognitive therapy and programming",
                      "Benefits from secure environment to prevent wandering"
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-2 text-slate-700 text-sm">
                        <CheckCircle className="h-4 w-4 text-violet-600 flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Assisted Living */}
                <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-rose-100 w-12 h-12 rounded-xl flex items-center justify-center">
                      <Heart className="h-6 w-6 text-rose-600" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">Choose Assisted Living If:</h3>
                  </div>
                  <ul className="space-y-2">
                    {[
                      "Needs help with daily activities but cognitively aware",
                      "Wants to maintain independence with support available",
                      "Socially engaged and enjoys group activities",
                      "Can self-direct and make own decisions",
                      "Needs medication reminders but not intensive management",
                      "Benefits from social engagement and community life"
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-2 text-slate-700 text-sm">
                        <CheckCircle className="h-4 w-4 text-rose-600 flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="bg-teal-50 border border-teal-200 rounded-2xl p-6">
                <p className="text-slate-700">
                  <strong className="text-teal-700">Important Note:</strong> Many Cleveland communities offer both assisted living and memory care, allowing for transitions as needs change. This "continuum of care" means your loved one can stay in the same community even if care needs increase.
                </p>
              </div>
            </div>

            {/* Essential Questions */}
            <div className="mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-slate-900">Essential Questions to Ask During Tours</h2>

              <div className="space-y-6">
                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                  <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Users className="h-5 w-5 text-teal-600" />
                    About Staffing & Care
                  </h3>
                  <ul className="grid md:grid-cols-2 gap-2">
                    {[
                      "What is your staff-to-resident ratio?",
                      "What training do staff members receive?",
                      "Is there an RN on staff? If so, what hours?",
                      "How do you handle medical emergencies?",
                      "Can residents keep their own doctors?",
                      "How often are care plans reviewed and updated?"
                    ].map((q) => (
                      <li key={q} className="flex items-start gap-2 text-slate-700 text-sm">
                        <HelpCircle className="h-4 w-4 text-teal-600 flex-shrink-0 mt-0.5" />
                        <span>{q}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                  <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-teal-600" />
                    About Daily Life
                  </h3>
                  <ul className="grid md:grid-cols-2 gap-2">
                    {[
                      "What does a typical day look like?",
                      "What activities are offered daily?",
                      "Can residents choose their meal times?",
                      "Is transportation provided for medical appointments?",
                      "What are visiting hours?",
                      "Can residents bring their own furniture?"
                    ].map((q) => (
                      <li key={q} className="flex items-start gap-2 text-slate-700 text-sm">
                        <HelpCircle className="h-4 w-4 text-teal-600 flex-shrink-0 mt-0.5" />
                        <span>{q}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Red Flags */}
            <div className="bg-red-50 border border-red-200 rounded-2xl p-8 mb-16">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <AlertTriangle className="h-6 w-6 text-red-600" />
                Red Flags to Watch For
              </h2>
              <ul className="grid md:grid-cols-2 gap-3">
                {[
                  "Staff seems rushed, unfriendly, or inattentive",
                  "Residents appear unkempt or unhappy",
                  "Unpleasant odors or unsanitary conditions",
                  "Lack of activities or residents sitting idle",
                  "High-pressure sales tactics or rush to sign contract",
                  "Won't let you visit unannounced or speak with residents privately",
                  "Recent citations or violations in state inspection reports",
                  "Vague answers about costs or care capabilities"
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-slate-700">
                    <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tour Checklist */}
            <div className="mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">The Tour Checklist</h2>
              <p className="text-lg text-slate-600 mb-8">
                Plan to tour each community at least twice—once scheduled, once unannounced. Bring this checklist:
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                  <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Eye className="h-5 w-5 text-teal-600" />
                    Environment & Safety
                  </h3>
                  <ul className="space-y-2">
                    {[
                      "Clean, well-maintained, and free of odors",
                      "Well-lit hallways and common areas",
                      "Safety features (grab bars, emergency call buttons)",
                      "Secure outdoor areas",
                      "Comfortable temperature"
                    ].map((item) => (
                      <li key={item} className="flex items-center gap-2 text-slate-700 text-sm">
                        <CheckCircle className="h-4 w-4 text-teal-600" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                  <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Users className="h-5 w-5 text-teal-600" />
                    Staff & Residents
                  </h3>
                  <ul className="space-y-2">
                    {[
                      "Staff are friendly, patient, and attentive",
                      "Residents appear happy and engaged",
                      "Staff know residents by name",
                      "Appropriate staff-to-resident ratio",
                      "Staff respond quickly to resident needs"
                    ].map((item) => (
                      <li key={item} className="flex items-center gap-2 text-slate-700 text-sm">
                        <CheckCircle className="h-4 w-4 text-teal-600" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                  <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Utensils className="h-5 w-5 text-teal-600" />
                    Meals & Dining
                  </h3>
                  <ul className="space-y-2">
                    {[
                      "Appetizing, nutritious meals",
                      "Menu variety and special diet accommodations",
                      "Pleasant dining atmosphere",
                      "Flexible meal times",
                      "Residents eating with enjoyment"
                    ].map((item) => (
                      <li key={item} className="flex items-center gap-2 text-slate-700 text-sm">
                        <CheckCircle className="h-4 w-4 text-teal-600" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                  <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-teal-600" />
                    Activities & Engagement
                  </h3>
                  <ul className="space-y-2">
                    {[
                      "Diverse activity calendar",
                      "Outings and community events",
                      "Exercise and wellness programs",
                      "Activities matched to residents' interests",
                      "Opportunities for spiritual and cultural activities"
                    ].map((item) => (
                      <li key={item} className="flex items-center gap-2 text-slate-700 text-sm">
                        <CheckCircle className="h-4 w-4 text-teal-600" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-amber-500 to-orange-500 py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Get Personalized Help Choosing Senior Living</h2>
            <p className="text-lg text-amber-100 mb-10">
              Our Cleveland advisors will help you navigate this important decision. We'll match you with communities that fit your needs, budget, and preferences—completely free.
            </p>
            <div className="bg-white p-8 rounded-2xl shadow-2xl">
              <SimpleContactForm 
                sourcePage="choosing-senior-living" 
                buttonText="Get Free Consultation"
                showMessage={false}
              />
            </div>
            <div className="mt-8">
              <a
                href="tel:+12166774630"
                className="inline-flex items-center gap-2 text-white hover:text-amber-100 font-semibold transition-colors"
              >
                <Phone className="h-5 w-5" />
                <span>Or call us directly: (216) 677-4630</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <StickyTourButton />
      <Footer />
    </main>
  );
}
