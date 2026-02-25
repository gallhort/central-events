import { create } from "zustand";

export interface SearchFilters {
  categorie: string;
  ville: string;
  typeEvenement: string;
  minNote: number;
  minPrix: number;
  maxPrix: number;
  sort: "pertinence" | "note" | "prix_asc";
  page: number;
}

interface SearchStore extends SearchFilters {
  setFilter: <K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) => void;
  resetFilters: () => void;
}

const defaultFilters: SearchFilters = {
  categorie: "",
  ville: "",
  typeEvenement: "",
  minNote: 0,
  minPrix: 0,
  maxPrix: 10000,
  sort: "pertinence",
  page: 1,
};

export const useSearchStore = create<SearchStore>((set) => ({
  ...defaultFilters,
  setFilter: (key, value) =>
    set((state) => ({
      ...state,
      [key]: value,
      // Reset to page 1 when filters change
      page: key === "page" ? (value as number) : 1,
    })),
  resetFilters: () => set(defaultFilters),
}));
