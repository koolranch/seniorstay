"use client";

import { FiHeart } from 'react-icons/fi';
import { useAuth } from '@/context/AuthContext';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type FavoriteButtonProps = {
  providerId: string | number;
  providerName: string;
  className?: string;
  size?: number;
  showToast?: boolean;
  compact?: boolean;
};

const FavoriteButton = ({
  providerId,
  providerName,
  className = '',
  size = 18,
  showToast = true,
  compact = false,
}: FavoriteButtonProps) => {
  const stringProviderId = String(providerId);

  const { addToFavorites, removeFromFavorites, isFavorite } = useAuth();
  const router = useRouter();
  const [isFavorited, setIsFavorited] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');

  // Check if provider is already in favorites
  useEffect(() => {
    setIsFavorited(isFavorite(stringProviderId));
  }, [stringProviderId, isFavorite]);

  // Handle favorite toggle
  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isFavorited) {
      removeFromFavorites(stringProviderId);
      if (showToast) {
        setFeedbackMessage(`${providerName} removed from favorites`);
        setShowFeedback(true);
      }
    } else {
      addToFavorites(stringProviderId);
      if (showToast) {
        setFeedbackMessage(`${providerName} added to favorites`);
        setShowFeedback(true);
      }
    }

    setIsFavorited(!isFavorited);
  };

  // Hide feedback after 3 seconds
  useEffect(() => {
    if (showFeedback) {
      const timer = setTimeout(() => {
        setShowFeedback(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showFeedback]);

  return (
    <>
      <button
        onClick={toggleFavorite}
        className={`p-2.5 rounded-full z-10 ${
          isFavorited ? 'bg-[#F5A623] text-white' : 'bg-white text-[#333333]'
        } shadow-sm hover:shadow-md transition ${className}`}
        aria-label={isFavorited ? `Remove ${providerName} from favorites` : `Save ${providerName} to favorites`}
      >
        <FiHeart
          className={isFavorited ? 'fill-white' : ''}
          size={size}
        />
      </button>

      {/* Feedback toast */}
      {showFeedback && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 bg-[#1b4d70] text-white px-6 py-3 rounded-lg shadow-lg flex items-center">
          <FiHeart className={isFavorited ? 'fill-[#F5A623] text-[#F5A623]' : ''} size={16} />
          <span className="ml-2">{feedbackMessage}</span>
        </div>
      )}
    </>
  );
};

export default FavoriteButton;
