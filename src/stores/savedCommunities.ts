import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SavedCommunity {
  id: string;
  name: string;
  location: string;
  careTypes: string[];
  image?: string;
  savedAt: number;
}

interface SavedCommunitiesState {
  saved: SavedCommunity[];
  add: (community: SavedCommunity) => void;
  remove: (id: string) => void;
  isSaved: (id: string) => boolean;
  clear: () => void;
}

export const useSavedCommunities = create<SavedCommunitiesState>()(
  persist(
    (set, get) => ({
      saved: [],
      add: (community) => {
        if (get().saved.some((c) => c.id === community.id)) return;
        set((state) => ({
          saved: [...state.saved, { ...community, savedAt: Date.now() }],
        }));
      },
      remove: (id) => {
        set((state) => ({
          saved: state.saved.filter((c) => c.id !== id),
        }));
      },
      isSaved: (id) => get().saved.some((c) => c.id === id),
      clear: () => set({ saved: [] }),
    }),
    {
      name: 'gfs-saved-communities',
    }
  )
);
