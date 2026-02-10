'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, X, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useSavedCommunities } from '@/stores/savedCommunities';

export default function SavedCommunitiesBar() {
  const { saved, remove } = useSavedCommunities();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated || saved.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed bottom-20 left-4 z-40 md:bottom-4 md:left-4"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
      >
        {isExpanded ? (
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-72 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50">
              <span className="font-semibold text-sm text-slate-900 flex items-center gap-2">
                <Heart className="h-4 w-4 text-red-500 fill-current" />
                Saved ({saved.length})
              </span>
              <button
                onClick={() => setIsExpanded(false)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="max-h-60 overflow-y-auto">
              {saved.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center justify-between px-4 py-2.5 border-b border-slate-50 last:border-0"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-900 truncate">{c.name}</p>
                    <p className="text-xs text-slate-500">{c.location}</p>
                  </div>
                  <button
                    onClick={() => remove(c.id)}
                    className="p-1 text-slate-300 hover:text-red-400 shrink-0 ml-2"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
            <div className="px-4 py-3 border-t border-slate-100">
              <Link
                href="/contact"
                className="flex items-center justify-center gap-2 w-full py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-lg transition-colors"
              >
                Compare & Get Pricing
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsExpanded(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white rounded-full shadow-lg border border-slate-200 hover:shadow-xl transition-shadow"
          >
            <Heart className="h-4 w-4 text-red-500 fill-current" />
            <span className="text-sm font-semibold text-slate-900">
              {saved.length} saved
            </span>
          </button>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
