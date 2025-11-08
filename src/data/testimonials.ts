export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  location: string;
  community?: string;
  rating: number;
  careType?: string;
}

export const testimonials: Testimonial[] = [
  {
    id: "test-1",
    quote: "Finding the right memory care for my mother was overwhelming. Guide for Seniors made it so much easier. They knew every community personally and helped us find the perfect fit in Shaker Heights.",
    author: "Jennifer M.",
    location: "Shaker Heights, OH",
    community: "Shaker Heights community",
    rating: 5,
    careType: "Memory Care"
  },
  {
    id: "test-2",
    quote: "We toured three communities in one week with their help. The local knowledge and pricing transparency saved us months of research. My father is thriving in his new assisted living home.",
    author: "Robert K.",
    location: "Beachwood, OH",
    rating: 5,
    careType: "Assisted Living"
  },
  {
    id: "test-3",
    quote: "The team understood our budget constraints and found an excellent memory care community in Parma that we could afford. The service is completely free - we were amazed!",
    author: "Maria S.",
    location: "Parma, OH",
    rating: 5,
    careType: "Memory Care"
  },
  {
    id: "test-4",
    quote: "Having someone who knew the difference between all the Cleveland communities was invaluable. They arranged tours, asked the right questions, and helped us make the best decision for Mom.",
    author: "David and Carol P.",
    location: "Cleveland, OH",
    rating: 5,
    careType: "Assisted Living"
  },
  {
    id: "test-5",
    quote: "I was so stressed trying to find care for my dad with Alzheimer's. They connected us with three great memory care options in Westlake and we found the perfect one within two weeks.",
    author: "Lisa T.",
    location: "Westlake, OH",
    rating: 5,
    careType: "Memory Care"
  },
  {
    id: "test-6",
    quote: "The personalized attention and follow-up made all the difference. They checked in after the move to make sure everything was going well. You can tell they genuinely care.",
    author: "Thomas W.",
    location: "Lakewood, OH",
    rating: 5,
    careType: "Assisted Living"
  },
  {
    id: "test-7",
    quote: "As a Cleveland native, I thought I knew all the senior living options. I was wrong! They showed us communities I'd never heard of that were perfect for what we needed.",
    author: "Patricia L.",
    location: "Rocky River, OH",
    rating: 5,
    careType: "Independent Living"
  },
  {
    id: "test-8",
    quote: "The cost comparison they provided was eye-opening. We were able to find a community with better amenities for less than we were paying for in-home care.",
    author: "Michael and Susan R.",
    location: "Strongsville, OH",
    rating: 5,
    careType: "Assisted Living"
  },
  {
    id: "test-9",
    quote: "They helped us navigate the Medicaid waiver process and found a community that accepts it. Without their help, we would have been completely lost.",
    author: "Angela H.",
    location: "Seven Hills, OH",
    rating: 5,
    careType: "Memory Care"
  },
  {
    id: "test-10",
    quote: "Quick, professional, and knowledgeable. They answered all our questions and never pressured us. Found the perfect community in less than a week!",
    author: "James D.",
    location: "Independence, OH",
    rating: 5,
    careType: "Assisted Living"
  },
  {
    id: "test-11",
    quote: "The local expertise made such a difference. They knew which communities had the best dementia care programs and which had the most attentive staff. Mom is so happy there.",
    author: "Karen F.",
    location: "Beachwood, OH",
    rating: 5,
    careType: "Memory Care"
  },
  {
    id: "test-12",
    quote: "From the first phone call to move-in day, they were there for us. Helped with paperwork, tour scheduling, and even gave us tips for the transition. Highly recommend!",
    author: "Elizabeth M.",
    location: "Cleveland Heights, OH",
    rating: 5,
    careType: "Assisted Living"
  }
];

// Get testimonials by care type
export function getTestimonialsByCareType(careType?: string, limit: number = 3): Testimonial[] {
  if (!careType) {
    return testimonials.slice(0, limit);
  }
  
  return testimonials
    .filter(t => t.careType === careType)
    .slice(0, limit);
}

// Get testimonials by location
export function getTestimonialsByLocation(location: string, limit: number = 2): Testimonial[] {
  return testimonials
    .filter(t => t.location.toLowerCase().includes(location.toLowerCase()))
    .slice(0, limit);
}

