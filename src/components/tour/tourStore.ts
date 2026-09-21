import { create } from "zustand";

import { useOnboardingStore } from "@/store/onboardingStore";

export type TourStep = {
  anchor: string;
  title: string;
  body: string;
  reveal?: () => void;
};

interface TourState {
  id: string | null;
  steps: TourStep[];
  index: number;
  start: (id: string, steps: TourStep[]) => void;
  next: () => void;
  finish: () => void;
}

export const useTourStore = create<TourState>((set, get) => ({
  id: null,
  steps: [],
  index: 0,

  start: (id, steps) => {
    if (get().id || steps.length === 0) return;
    set({ id, steps, index: 0 });
  },

  next: () => {
    const { index, steps } = get();
    if (index + 1 < steps.length) set({ index: index + 1 });
    else get().finish();
  },

  finish: () => {
    const { id } = get();
    if (id) useOnboardingStore.getState().seeTour(id);
    set({ id: null, steps: [], index: 0 });
  },
}));
