"use client";

import React from 'react';
import { Community } from '@/data/facilities';
import PropertyCard from './PropertyCard';

// Parse senior living facility data from CSV
const parseSeniorLivingData = (facilityInfo: string) => {
  const nameRegex = /^"([^"]+),\s([^-]+)-\s([^"]+)"$/;
  const nameMatch = facilityInfo.match(nameRegex);

  let name = facilityInfo;
  let location = '';
  let careTypes: string[] = [];

  if (nameMatch) {
    name = nameMatch[1].trim();
    location = `${nameMatch[2].trim()}, ${nameMatch[3].trim()}`;

    // Extract care types from inside parentheses
    const careTypesRegex = /-\s([^"]+)/;
    const careTypesMatch = facilityInfo.match(careTypesRegex);

    if (careTypesMatch) {
      const careTypesPart = careTypesMatch[1];
      careTypes = careTypesPart.split(',').map(type => type.trim());
    }
  } else {
    // Fallback if regex doesn't match
    const parts = facilityInfo.replace(/"/g, '').split(',');
    if (parts.length >= 2) {
      name = parts[0].trim();
      const locationParts = parts[1].split('-');
      location = locationParts[0].trim();

      // Extract care types
      if (locationParts.length > 1) {
        careTypes = locationParts[1].split(',').map(type => type.trim());
      }
    }
  }

  return { name, location, careTypes };
};

// Senior living facilities data from the CSV file
const seniorLivingFacilities = [
  "Westwood Place, Cleveland, OH - Assisted Living",
  "Summit Point, Macedonia, OH - Assisted Living",
  "Mount Alverna Village, Parma, OH - Assisted Living, Memory Care",
  "Rose Senior Living at Beachwood, Beachwood, OH - Independent Living, Assisted Living",
  "Vitalia Rockside, Seven Hills, OH - Independent Living, Assisted Living, Memory Care",
  "StoryPoint Shaker Heights, Shaker Heights, OH - Independent Living, Assisted Living, Memory Care",
  "The Woodlands by Heritage Retirement Communities, Shaker Heights, OH - Independent Living",
  "Forest Hills Place, Cleveland, OH - Assisted Living",
  "Woodside Senior Living, Bedford, OH - Assisted Living",
  "Eliza Jennings, Cleveland, OH - Independent Living, Assisted Living",
  "Brooklyn Pointe Assisted Living and Memory Care, Brooklyn, OH - Assisted Living, Memory Care",
  "HarborChase of Shaker Heights, Shaker Heights, OH - Assisted Living, Memory Care",
  "Marymount Place, Garfield Heights, OH - Assisted Living",
  "Vista Springs Ravinia, Independence, OH - Assisted Living, Memory Care",
  "Haven at Lakewood, Lakewood, OH - Assisted Living",
  "American House Macedonia, Macedonia, OH - Independent Living, Assisted Living"
];

// Process the facilities data
const processedFacilities = seniorLivingFacilities.map((facility, index) => {
  const { name, location, careTypes } = parseSeniorLivingData(facility);

  // Generate random image for each facility (in a real app, you'd use actual facility images)
  const imagePool = [
    "https://ext.same-assets.com/3140348022/277918512.jpeg",
    "https://ext.same-assets.com/3140348022/554927045.jpeg",
    "https://ext.same-assets.com/3140348022/1483408660.jpeg",
    "https://ext.same-assets.com/3140348022/2975331289.jpeg",
    "https://ext.same-assets.com/3140348022/2616406230.jpeg",
    "https://ext.same-assets.com/3140348022/3923490053.jpeg"
  ];

  // Select 1-2 random images for each facility
  const numImages = Math.floor(Math.random() * 2) + 1;
  const images = Array(numImages).fill(0).map(() =>
    imagePool[Math.floor(Math.random() * imagePool.length)]
  );

  return {
    id: `facility-${index + 1}`,
    name,
    location,
    careTypes,
    images
  };
});

interface PropertyGridProps {
  communities: Community[];
}

export default function PropertyGrid({ communities }: PropertyGridProps) {
  return (
    <div className="container px-6 py-8 mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {communities.map((community) => (
          <PropertyCard key={community.id} community={community} />
        ))}
      </div>
    </div>
  );
}
