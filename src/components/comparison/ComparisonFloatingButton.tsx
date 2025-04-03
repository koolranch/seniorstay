"use client";

import React from 'react';
import { useComparison } from '@/context/ComparisonContext';
import { Button } from '@/components/ui/button';
import { Scale } from 'lucide-react';
import { cn } from '@/lib/utils';
import ComparisonDrawer from './ComparisonDrawer';

export default function ComparisonFloatingButton() {
  const { comparisonList } = useComparison();
  const [isVisible, setIsVisible] = React.useState(false);

  // Don't show button if no items are in comparison
  if (comparisonList.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <ComparisonDrawer
        trigger={
          <Button
            className={cn(
              'rounded-full shadow-lg transition-all duration-300',
              isVisible ? 'opacity-100' : 'opacity-0'
            )}
            size="lg"
            onClick={() => setIsVisible(!isVisible)}
          >
            <Scale className="mr-2 h-5 w-5" />
            Compare ({comparisonList.length})
          </Button>
        }
      />
    </div>
  );
}
