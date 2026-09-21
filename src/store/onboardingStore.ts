import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import storage from "./storage";

interface OnboardingState {
  completed: boolean;
  photoTipsSeen: boolean;
  toursSeen: string[];
  trialEndedSeen: boolean;

  complete: () => void;
  seePhotoTips: () => void;
  seeTour: (id: string) => void;
  resetTours: () => void;
  seeTrialEnded: () => void;
  reset: () => void;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      completed: false,
      photoTipsSeen: false,
      toursSeen: [],
      trialEndedSeen: false,

      complete: () => set({ completed: true }),
      seePhotoTips: () => set({ photoTipsSeen: true }),
      seeTour: (id) =>
        set((state) =>
          state.toursSeen.includes(id)
            ? state
            : { toursSeen: [...state.toursSeen, id] },
        ),
      resetTours: () => set({ toursSeen: [] }),
      seeTrialEnded: () => set({ trialEndedSeen: true }),
      reset: () =>
        set({
          completed: false,
          photoTipsSeen: false,
          toursSeen: [],
          trialEndedSeen: false,
        }),
    }),
    {
      name: "onboarding-storage",
      storage: createJSONStorage(() => storage),
    },
  ),
);
