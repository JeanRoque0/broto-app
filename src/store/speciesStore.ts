import { create } from "zustand";

import { Species } from "@/services/api/search";

interface SpeciesState {
  selected: Species | null;
  select: (species: Species) => void;
}

export const useSpeciesStore = create<SpeciesState>((set) => ({
  selected: null,
  select: (selected) => set({ selected }),
}));
