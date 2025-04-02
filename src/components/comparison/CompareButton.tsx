"use client";

import React from 'react';
import { ScaleIcon, CheckIcon, PlusIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useComparison } from '@/context/ComparisonContext';
import { Facility } from '@/data/facilities';

interface CompareButtonProps {
  facility: Facility;
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
          <TooltipContent side="bottom">
            {isSelected
              ? "Remove from comparison"
              : isFull
                ? "Maximum of 4 facilities can be compared"
                : "Add to comparison"
            }
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <Button
      variant={isSelected ? "default" : "outline"}
      size="sm"
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        handleToggle();
      }}
      disabled={isFull}
      className={`${isSelected ? 'bg-primary text-white' : 'border-primary text-primary'} ${isFull ? 'opacity-50' : ''} ${className}`}
    >
      {isSelected ? (
        <>
          <CheckIcon className="h-4 w-4 mr-2" />
          Added to Compare
        </>
      ) : (
        <>
          <PlusIcon className="h-4 w-4 mr-2" />
          Add to Compare
        </>
      )}
    </Button>
  );
};

export default CompareButton;
