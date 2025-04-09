// Helper function to generate slug from name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// Helper function to parse services
function parseServices(services: string): string[] {
  return services.split(',').map(service => service.trim());
}

// Helper function to generate description
function generateDescription(name: string, services: string[]): string {
  const serviceList = services.join(', ');
  return `${name} offers a welcoming environment with ${serviceList.toLowerCase()} services, providing personalized care and support for residents in a comfortable, community-focused setting.`;
}

// Helper function to extract city and state from address
function extractLocation(address: string): { city: string; state: string } {
  const match = address.match(/, ([^,]+), ([A-Z]{2})/);
  if (match) {
    return {
      city: match[1].trim(),
      state: match[2].trim()
    };
  }
  return { city: '', state: '' };
}

export interface Community {
  id: number;
  name: string;
  slug: string;
  address: string;
  city: string;
  state: string;
  type: string;
  services: string[];
  image: string;
  description: string;
  rating: number;
  amenities: string[];
  price: string;
  phone: string;
}

export const communities: Community[] = [
  {
    id: 1,
    name: "Sunrise at Parma",
    slug: "sunrise-at-parma",
    city: "Parma",
    state: "OH",
    address: "7766 Broadview Rd, Parma, OH 44134",
    type: "Assisted Living",
    services: ["Assisted Living", "Memory Care"],
    image: "https://source.unsplash.com/featured/?senior-living",
    description: "Sunrise at Parma offers personalized care in a peaceful setting.",
    rating: 4.5,
    amenities: ["Assisted Living", "Memory Care"],
    price: "$3,500/month",
    phone: "555-0123"
  }
]; 