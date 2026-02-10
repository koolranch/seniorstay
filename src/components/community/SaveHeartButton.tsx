'use client';

import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { useSavedCommunities } from '@/stores/savedCommunities';

interface SaveHeartButtonProps {
  communityId: string;
  communityName: string;
  location: string;
  careTypes: string[];
  image?: string;
  className?: string;
  size?: 'sm' | 'md';
}

export default function SaveHeartButton({
  communityId,
  communityName,
  location,
  careTypes,
  image,
  className = '',
  size = 'md',
}: SaveHeartButtonProps) {
  const { add, remove, isSaved } = useSavedCommunities();
  const [saved, setSaved] = useState(false);

  // Sync with store (hydration-safe)
  useEffect(() => {
    setSaved(isSaved(communityId));
  }, [communityId, isSaved]);

  const toggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (saved) {
      remove(communityId);
      setSaved(false);
    } else {
      add({ id: communityId, name: communityName, location, careTypes, image });
      setSaved(true);
    }
  };

  const iconSize = size === 'sm' ? 'h-4 w-4' : 'h-5 w-5';
  const padSize = size === 'sm' ? 'p-1.5' : 'p-2.5';

  return (
    <button
      onClick={toggle}
      className={`${padSize} rounded-full transition-all duration-200 ${
        saved
          ? 'bg-red-50 text-red-500 hover:bg-red-100'
          : 'bg-white/80 text-slate-400 hover:text-red-400 hover:bg-white'
      } ${className}`}
      aria-label={saved ? 'Remove from saved' : 'Save community'}
      title={saved ? 'Remove from saved' : 'Save community'}
    >
      <Heart className={`${iconSize} ${saved ? 'fill-current' : ''}`} />
    </button>
  );
}
