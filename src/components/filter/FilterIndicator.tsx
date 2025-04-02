"use client";

import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FilterIndicatorProps {
  label: string;
  isActive: boolean;
  onClear: () => void;
}

const FilterIndicator = ({
  label,
  isActive,
  onClear
}: FilterIndicatorProps) => {
  if (!isActive) return null;

  return (
    <div className="px-2 py-1.5 bg-primary/5 rounded-full flex items-center max-w-full">
      <span className="text-sm text-primary font-medium truncate">
        {label}
      </span>
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6 p-0.5 ml-1 text-primary/80 hover:text-primary hover:bg-primary/10 rounded-full shrink-0"
        onClick={onClear}
        aria-label={`Clear ${label} filter`}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default FilterIndicator;
