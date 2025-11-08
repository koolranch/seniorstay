// Generate default amenities based on care types
export function getDefaultAmenities(careTypes: string[]): string[] {
  const baseAmenities = [
    "24-Hour Staff",
    "Emergency Response System",
    "Housekeeping Services",
    "Social Activities & Events"
  ];

  const amenitiesByType: Record<string, string[]> = {
    "Memory Care": [
      "Secure Environment",
      "Specialized Dementia Care",
      "Cognitive Therapy Programs",
      "Wandering Prevention",
      "Memory-Enhancing Activities"
    ],
    "Assisted Living": [
      "Personal Care Assistance",
      "Medication Management",
      "Restaurant-Style Dining",
      "Transportation Services",
      "Wellness Programs"
    ],
    "Independent Living": [
      "Fitness Center",
      "Restaurant-Style Dining",
      "Transportation Services",
      "Planned Outings & Trips",
      "Maintenance-Free Living"
    ],
    "Skilled Nursing": [
      "Licensed Nursing Care",
      "Physical Therapy",
      "Occupational Therapy",
      "Medical Services"
    ],
    "Rehabilitation": [
      "Physical Therapy",
      "Occupational Therapy",
      "Speech Therapy",
      "Post-Hospital Care"
    ]
  };

  const allAmenities = new Set(baseAmenities);
  
  careTypes.forEach(careType => {
    const typeAmenities = amenitiesByType[careType] || [];
    typeAmenities.forEach(amenity => allAmenities.add(amenity));
  });

  return Array.from(allAmenities);
}

