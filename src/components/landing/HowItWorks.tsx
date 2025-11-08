import React from 'react';
import { Phone, Search, Calendar, CheckCircle } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      number: 1,
      icon: Phone,
      title: "Tell Us Your Needs",
      description: "Quick call or form - tell us about your loved one's care needs, budget, and preferred areas.",
      time: "5 minutes"
    },
    {
      number: 2,
      icon: Search,
      title: "We Find Perfect Matches",
      description: "Our Cleveland experts match you with communities that fit your specific situation and preferences.",
      time: "Same day"
    },
    {
      number: 3,
      icon: Calendar,
      title: "Tour & Choose",
      description: "We arrange tours, answer questions, and help you make the best decision for your family.",
      time: "Within 7 days"
    }
  ];

  return (
    <div className="bg-white py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">How We Help (3 Simple Steps)</h2>
            <p className="text-lg text-gray-600">Most families find their perfect community in less than a week</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connection line - hidden on mobile */}
            <div className="hidden md:block absolute top-16 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20" style={{top: '4rem'}} />

            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={step.number} className="relative">
                  <div className="flex flex-col items-center text-center">
                    {/* Step number circle */}
                    <div className="relative mb-6">
                      <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center shadow-lg relative z-10">
                        <Icon className="h-10 w-10 text-white" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md z-20">
                        {step.number}
                      </div>
                    </div>

                    <h3 className="text-xl font-bold mb-3 text-gray-900">{step.title}</h3>
                    <p className="text-gray-600 mb-3 leading-relaxed">{step.description}</p>
                    <div className="inline-flex items-center gap-2 text-sm text-primary font-semibold bg-primary/10 px-3 py-1 rounded-full">
                      <CheckCircle className="h-4 w-4" />
                      {step.time}
                    </div>
                  </div>

                  {/* Arrow for desktop - between steps */}
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute right-0 top-16 transform translate-x-1/2 text-primary/30">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                      </svg>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 text-lg">
              <span className="font-semibold text-gray-900">Ready to get started?</span> Fill out the form above or scroll down to browse communities.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

