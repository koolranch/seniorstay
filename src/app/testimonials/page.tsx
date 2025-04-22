import React from 'react';

export default function TestimonialsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Testimonials</h1>

      <h3 className="text-xl font-semibold mb-4 text-center">
        Hear from the families and providers who trust GuideForSeniors
      </h3>

      <p className="mb-6 text-center">
        We're honored to be part of so many care journeys. Here's what people
        are saying about their experience with GuideForSeniors — in their own
        words.
      </p>

      <hr className="my-8" />

      <h2 className="text-2xl font-semibold mt-6 mb-3">👩‍👧 Carol M. – Daughter of Resident, Rocky River, OH</h2>
      <blockquote className="border-l-4 border-gray-300 pl-4 italic my-4">
        <p>
          "I didn't know where to start. GuideForSeniors sent me a short list of
          nearby communities within a day — no pressure, no overwhelm. Just
          help."
        </p>
      </blockquote>

      <hr className="my-8" />

      <h2 className="text-2xl font-semibold mt-6 mb-3">🧓 Timothy R. – Family Member, Akron, OH</h2>
      <blockquote className="border-l-4 border-gray-300 pl-4 italic my-4">
        <p>
          "The platform made it so easy to compare options side by side. We found
          a great assisted living community near my mom's church, and she's
          thriving."
        </p>
      </blockquote>

      <hr className="my-8" />

      <h2 className="text-2xl font-semibold mt-6 mb-3">🏡 Melissa S. – Community Director, Willow Grove Senior Living</h2>
      <blockquote className="border-l-4 border-gray-300 pl-4 italic my-4">
        <p>
          "I've worked with a lot of referral services, but the leads from
          GuideForSeniors are a step above — families are better informed and
          more prepared."
        </p>
      </blockquote>

      <hr className="my-8" />

      <h2 className="text-2xl font-semibold mt-6 mb-3">👨‍👦 Robert H. – Son of Resident, Parma, OH</h2>
      <blockquote className="border-l-4 border-gray-300 pl-4 italic my-4">
        <p>
          "What I appreciated most was the honesty. No one tried to 'sell' me.
          Just helpful, clear info that saved me time and stress."
        </p>
      </blockquote>

      <hr className="my-8" />

      <h2 className="text-2xl font-semibold mt-6 mb-3">🧓 Marie B. – Family Caregiver, Mentor, OH</h2>
      <blockquote className="border-l-4 border-gray-300 pl-4 italic my-4">
        <p>
          "After Dad's fall, I had to move fast. GuideForSeniors helped me
          compare care levels and connect with communities that had openings. I
          didn't feel alone in the process."
        </p>
      </blockquote>

      <hr className="my-8" />

      <p className="text-center mt-6">
        Want to share your experience?{' '}
        <a href="#" className="font-semibold text-blue-600 hover:underline">
          Submit your testimonial →
        </a>
      </p>
    </div>
  );
} 