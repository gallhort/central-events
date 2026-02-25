import { create } from "zustand";

interface FavoritesStore {
  favorites: Set<string>;
  toggleFavorite: (prestataireId: string) => void;
  setFavorites: (ids: string[]) => void;
  isFavorite: (prestataireId: string) => boolean;
}

export const useFavoritesStore = create<FavoritesStore>((set, get) => ({
  favorites: new Set<string>(),
  toggleFavorite: (prestataireId) =>
    set((state) => {
      const next = new Set(state.favorites);
      if (next.has(prestataireId)) {
        next.delete(prestataireId);
      } else {
        next.add(prestataireId);
      }
      return { favorites: next };
    }),
  setFavorites: (ids) => set({ favorites: new Set(ids) }),
  isFavorite: (prestataireId) => get().favorites.has(prestataireId),
}));
