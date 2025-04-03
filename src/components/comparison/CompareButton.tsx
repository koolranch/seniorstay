"use client";

import React from 'react';
import { Community } from '@/data/facilities';
import { useComparison } from '@/context/ComparisonContext';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CompareButtonProps {
  facility: Community;
  className?: string;
}

export const CompareButton = ({
  facility,
  className = ''
}: CompareButtonProps) => {
  const { addToComparison, removeFromComparison, isInComparison, comparisonList } = useComparison();
  const isSelected = isInComparison(facility.id);
  const isFull = comparisonList.length >= 4 && !isSelected;

  const handleClick = () => {
    if (isSelected) {
      removeFromComparison(facility.id);
    } else if (!isFull) {
      addToComparison(facility);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn(
        'absolute top-2 right-2 h-8 w-8 rounded-full',
        isSelected ? 'bg-red-100 hover:bg-red-200 text-red-600' : 'bg-white/90 hover:bg-white',
        isFull && !isSelected ? 'opacity-50 cursor-not-allowed' : '',
        className
      )}
      onClick={handleClick}
      disabled={isFull && !isSelected}
      aria-label={isSelected ? 'Remove from comparison' : 'Add to comparison'}
    >
      <Heart
        className={cn(
          'h-4 w-4',
          isSelected ? 'fill-current' : ''
        )}
      />
    </Button>
  );
};
