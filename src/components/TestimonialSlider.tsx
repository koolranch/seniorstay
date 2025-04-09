import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { FiChevronLeft, FiChevronRight, FiMessageSquare } from 'react-icons/fi';

interface Testimonial {
  id: string | number;
  quote: string;
  author: string;
  relation?: string;
  avatar?: string;
  communityName?: string;
}

interface TestimonialSliderProps {
  testimonials: Testimonial[];
  autoplay?: boolean;
  interval?: number;
  className?: string;
}

const TestimonialSlider = ({
  testimonials,
  autoplay = true,
  interval = 5000,
  className = '',
}: TestimonialSliderProps) => {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const length = testimonials.length;

  // Function to move to the next slide - wrapped in useCallback
  const nextSlide = useCallback(() => {
    setCurrent(current => current === length - 1 ? 0 : current + 1);
  }, [length]);

  // Function to move to the previous slide
  const prevSlide = () => {
    setCurrent(current === 0 ? length - 1 : current - 1);
  };

  // Set up autoplay
  useEffect(() => {
    if (!autoplay || isPaused || length <= 1) return;

    const timer = setInterval(() => {
      nextSlide();
    }, interval);

    return () => clearInterval(timer);
  }, [autoplay, isPaused, interval, length, nextSlide]);

  // If there are no testimonials or only one, adjust the UI accordingly
  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  if (testimonials.length === 1) {
    return (
      <div className={`bg-[#f1f6f0] rounded-xl p-6 md:p-8 ${className}`}>
        <SingleTestimonial testimonial={testimonials[0]} />
      </div>
    );
  }

  return (
    <div
      className={`relative bg-[#f1f6f0] rounded-xl p-6 md:p-8 ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-[#1b4d70] flex items-center">
          <FiMessageSquare className="mr-2" />
          What Families Are Saying
        </h3>
        <div className="flex space-x-2">
          <button
            onClick={prevSlide}
            className="p-2 rounded-full bg-white text-[#1b4d70] hover:bg-[#1b4d70] hover:text-white transition-colors"
            aria-label="Previous testimonial"
          >
            <FiChevronLeft size={18} />
          </button>
          <button
            onClick={nextSlide}
            className="p-2 rounded-full bg-white text-[#1b4d70] hover:bg-[#1b4d70] hover:text-white transition-colors"
            aria-label="Next testimonial"
          >
            <FiChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className="overflow-hidden relative">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className="min-w-full"
              aria-hidden={current !== index}
            >
              <SingleTestimonial testimonial={testimonial} />
            </div>
          ))}
        </div>
      </div>

      {/* Dots indicator */}
      <div className="flex justify-center space-x-2 mt-6">
        {testimonials.map((testimonial, index) => (
          <button
            key={`dot-${testimonial.id || index}`}
            onClick={() => setCurrent(index)}
            className={`h-2 w-2 rounded-full transition-colors ${
              current === index
                ? 'bg-[#1b4d70]'
                : 'bg-[#A7C4A0] hover:bg-[#1b4d70]/50'
            }`}
            aria-label={`Go to testimonial ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

// Sub-component for single testimonial
const SingleTestimonial = ({ testimonial }: { testimonial: Testimonial }) => (
  <div className="flex flex-col">
    <div className="mb-4">
      <blockquote className="text-lg italic text-[#333333]">
        "{testimonial.quote}"
      </blockquote>
    </div>
    <div className="flex items-center mt-auto">
      {testimonial.avatar ? (
        <div className="relative h-12 w-12 rounded-full overflow-hidden mr-4">
          <Image
            src={testimonial.avatar}
            alt={testimonial.author}
            fill
            className="object-cover"
          />
        </div>
      ) : (
        <div className="h-12 w-12 rounded-full bg-[#1b4d70] text-white flex items-center justify-center mr-4">
          {testimonial.author.charAt(0)}
        </div>
      )}
      <div>
        <p className="font-medium text-[#1b4d70]">{testimonial.author}</p>
        {testimonial.relation && (
          <p className="text-sm text-[#666666]">{testimonial.relation}</p>
        )}
        {testimonial.communityName && (
          <p className="text-sm text-[#666666]">
            {testimonial.communityName}
          </p>
        )}
      </div>
    </div>
  </div>
);

export default TestimonialSlider;
