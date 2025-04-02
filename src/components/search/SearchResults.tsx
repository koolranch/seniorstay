"use client";

import React from 'react';
import { Community } from '@/data/facilities';
import LocationCard from '@/components/property/LocationCard';

interface SearchResultsProps {
  query: string;
  results: Community[];
}

const SearchResults: React.FC<SearchResultsProps> = ({ query, results }) => {
  if (results.length === 0) {
    return (
      <div className="container px-4 py-16 mx-auto text-center">
        <h2 className="text-xl font-semibold mb-4">No results found</h2>
        <p className="text-gray-600">
          No senior living communities match your search for "{query}".
          <br />
          Please try a different search term or browse by category or location.
        </p>
      </div>
    );
  }

  return (
    <div className="container px-4 py-8 mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">
          Search results for "{query}"
          <span className="text-gray-500 text-lg font-normal ml-2">
            ({results.length} {results.length === 1 ? 'community' : 'communities'})
          </span>
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {results.map((community) => (
          <LocationCard key={community.id} community={community} />
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
