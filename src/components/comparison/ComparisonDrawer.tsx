"use client";

import React from 'react';
import { Community } from '@/data/facilities';
import { useComparison } from '@/context/ComparisonContext';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { X } from 'lucide-react';

interface ComparisonDrawerProps {
  trigger: React.ReactNode;
}

export default function ComparisonDrawer({ trigger }: ComparisonDrawerProps) {
  const { comparisonList, removeFromComparison, clearComparison } = useComparison();
  const [open, setOpen] = React.useState(false);

  const getCareTypeAvailability = (careType: string) => {
    return comparisonList.filter((community: Community) => 
      community.careTypes?.includes(careType)
    ).length;
  };

  const handleRemove = (id: string) => {
    removeFromComparison(id);
    if (comparisonList.length === 1) {
      setOpen(false);
    }
  };

  const handleClear = () => {
    clearComparison();
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {trigger}
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-xl">
        <SheetHeader>
          <SheetTitle>Compare Communities ({comparisonList.length}/4)</SheetTitle>
        </SheetHeader>
        <div className="p-4 space-y-4">
          {comparisonList.length === 0 ? (
            <p className="text-center text-gray-500">No communities selected for comparison</p>
          ) : (
            <>
              <div className="grid gap-4">
                {comparisonList.map((community: Community) => (
                  <div key={community.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">{community.name}</h3>
                      <p className="text-sm text-gray-500">{community.location}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemove(community.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <div className="flex justify-between">
                <Button variant="outline" onClick={handleClear}>
                  Clear All
                </Button>
                <Button onClick={() => setOpen(false)}>
                  Close
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
