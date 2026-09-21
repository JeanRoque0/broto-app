import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import storage from "./storage";

interface OnboardingState {
  completed: boolean;
  photoTipsSeen: boolean;
  toursSeen: string[];

  complete: () => void;
  seePhotoTips: () => void;
  seeTour: (id: string) => void;
  resetTours: () => void;
  reset: () => void;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      completed: false,
      photoTipsSeen: false,
      toursSeen: [],

      complete: () => set({ completed: true }),
      seePhotoTips: () => set({ photoTipsSeen: true }),
      seeTour: (id) =>
        set((state) =>
          state.toursSeen.includes(id)
            ? state
            : { toursSeen: [...state.toursSeen, id] },
        ),
      resetTours: () => set({ toursSeen: [] }),
      reset: () => set({ completed: false, photoTipsSeen: false, toursSeen: [] }),
    }),
    {
      name: "onboarding-storage",
      storage: createJSONStorage(() => storage),
    },
  ),
);
