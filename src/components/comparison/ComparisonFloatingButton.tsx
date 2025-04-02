"use client";

import React from 'react';
import { Scale } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useComparison } from '@/context/ComparisonContext';
import ComparisonDrawer from './ComparisonDrawer';

export default function ComparisonFloatingButton() {
  const { communities } = useComparison();

  // Don't show button if no communities are in comparison
  if (communities.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <ComparisonDrawer
        trigger={
          <Button
            className="rounded-full px-5 py-6 shadow-lg flex items-center gap-2"
          >
            <Scale className="h-5 w-5" />
            <span>Compare ({communities.length})</span>
          </Button>
        }
      />
    </div>
  );
}
