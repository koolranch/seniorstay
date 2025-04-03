"use client";

import React from 'react';
import { X, Check, AlertCircle } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useComparison } from '@/context/ComparisonContext';
import Link from 'next/link';

interface ComparisonDrawerProps {
  trigger: React.ReactNode;
}

export default function ComparisonDrawer({ trigger }: ComparisonDrawerProps) {
  const { comparisonList, removeFromComparison, clearComparison } = useComparison();
  const [open, setOpen] = React.useState(false);

  const getCareTypeAvailability = (careType: string) => {
    return comparisonList.map(community => {
      return community.careTypes.includes(careType);
    });
  };

  // Get all unique care types across all compared communities
  const allCareTypes = Array.from(
    new Set(comparisonList.flatMap(community => community.careTypes))
  ).sort();

  // Get all common amenities
  const getCommonAmenities = () => {
    if (comparisonList.length === 0) return [];

    // Start with the amenities of the first community
    const firstCommunityAmenities = comparisonList[0].amenities || [];

    // Find common amenities across all communities
    return firstCommunityAmenities.filter(amenity =>
      comparisonList.every(community =>
        community.amenities ? community.amenities.includes(amenity) : false
      )
    );
  };

  const commonAmenities = getCommonAmenities();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent className="sm:max-w-xl w-full overflow-y-auto">
        <SheetHeader className="mb-4">
          <SheetTitle className="text-xl">Compare Communities</SheetTitle>
        </SheetHeader>

        {comparisonList.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-12 text-center">
            <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium mb-2">No Communities Selected</h3>
            <p className="text-gray-600 mb-6">
              Add communities to your comparison list by clicking the heart icon on community cards.
            </p>
            <Button asChild variant="outline">
              <Link href="/" onClick={() => setOpen(false)}>
                Browse Communities
              </Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-gray-600">
                {comparisonList.length} of 4 communities selected
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearComparison}
                className="text-gray-600 hover:text-red-600"
              >
                Clear All
              </Button>
            </div>

            {/* Community Names Row */}
            <div className="grid grid-cols-[120px_repeat(auto-fill,minmax(120px,1fr))] gap-2 border-b pb-3 mb-3">
              <div className="font-semibold">Community</div>
              {comparisonList.map(community => (
                <div key={community.id} className="relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-gray-100 hover:bg-gray-200"
                    onClick={() => removeFromComparison(community.id)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                  <Link
                    href={`/community/${community.id}/${community.name.toLowerCase().replace(/\s+/g, '-')}`}
                    className="font-medium text-sm hover:text-primary hover:underline"
                    onClick={() => setOpen(false)}
                  >
                    {community.name}
                  </Link>
                </div>
              ))}
            </div>

            {/* Location Row */}
            <div className="grid grid-cols-[120px_repeat(auto-fill,minmax(120px,1fr))] gap-2 border-b pb-3 mb-3">
              <div className="font-semibold">Location</div>
              {comparisonList.map(community => (
                <div key={`${community.id}-location`} className="text-sm">
                  {community.location}
                </div>
              ))}
            </div>

            {/* Care Types Section */}
            <div className="border-b pb-3 mb-3">
              <h3 className="font-semibold mb-2">Care Types</h3>

              {allCareTypes.map(careType => {
                const availability = getCareTypeAvailability(careType);

                return (
                  <div
                    key={careType}
                    className="grid grid-cols-[120px_repeat(auto-fill,minmax(120px,1fr))] gap-2 mb-2"
                  >
                    <div className="text-sm">{careType}</div>
                    {availability.map((available, index) => (
                      <div key={index} className="text-center">
                        {available ? (
                          <Check className="h-4 w-4 text-green-600 mx-auto" />
                        ) : (
                          <X className="h-4 w-4 text-red-400 mx-auto" />
                        )}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>

            {/* Common Amenities */}
            {commonAmenities.length > 0 && (
              <div className="mb-3">
                <h3 className="font-semibold mb-2">Common Amenities</h3>
                <div className="grid grid-cols-2 gap-2">
                  {commonAmenities.map((amenity, index) => (
                    <div key={index} className="flex items-center text-sm">
                      <Check className="h-3 w-3 text-green-600 mr-2" />
                      {amenity}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Contact Buttons */}
            <div className="mt-6">
              <h3 className="font-semibold mb-2">Request Information</h3>
              <div className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-2">
                {comparisonList.map(community => (
                  <div key={`${community.id}-buttons`} className="space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full text-xs"
                      asChild
                    >
                      <Link
                        href={`/community/${community.id}/${community.name.toLowerCase().replace(/\s+/g, '-')}`}
                        onClick={() => setOpen(false)}
                      >
                        View Details
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
