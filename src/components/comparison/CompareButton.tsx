"use client";

import React from 'react';
import { ScaleIcon, CheckIcon, PlusIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useComparison } from '@/context/ComparisonContext';
import { Community } from '@/data/facilities';

interface CompareButtonProps {
  facility: Community;
  variant?: 'icon' | 'button';
  className?: string;
}

const CompareButton: React.FC<CompareButtonProps> = ({
  facility,
  variant = 'icon',
  className = ''
}) => {
  const { addToComparison, removeFromComparison, isInComparison, comparisonList } = useComparison();
  const isSelected = isInComparison(facility.id);
  const isFull = comparisonList.length >= 4 && !isSelected;

  const handleToggle = () => {
    if (isSelected) {
      removeFromComparison(facility.id);
    } else if (!isFull) {
      addToComparison(facility);
    }
  };

  if (variant === 'icon') {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                handleToggle();
              }}
              className={`p-2 rounded-full ${isSelected ? 'bg-primary text-white' : 'bg-white/90 hover:bg-white'} ${isFull ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
              disabled={isFull}
              aria-label={isSelected ? "Remove from comparison" : "Add to comparison"}
            >
              {isSelected ? (
                <CheckIcon className="h-4 w-4" />
              ) : (
                <ScaleIcon className="h-4 w-4" />
              )}
            </button>
          </TooltipTrigger>
          <TooltipContent>
            {isSelected ? "Remove from comparison" : "Add to comparison"}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <Button
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        handleToggle();
      }}
      variant={isSelected ? "default" : "outline"}
      className={`w-full ${isFull ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      disabled={isFull}
    >
      {isSelected ? (
        <>
          <CheckIcon className="mr-2 h-4 w-4" />
          Added to Comparison
        </>
      ) : (
        <>
          <PlusIcon className="mr-2 h-4 w-4" />
          Add to Comparison
        </>
      )}
    </Button>
  );
};

export default CompareButton;
