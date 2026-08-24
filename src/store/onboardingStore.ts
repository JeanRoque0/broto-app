import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import storage from "./storage";

interface OnboardingState {
  completed: boolean;
  photoTipsSeen: boolean;

  complete: () => void;
  seePhotoTips: () => void;
  reset: () => void;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      completed: false,
      photoTipsSeen: false,

      complete: () => set({ completed: true }),
      seePhotoTips: () => set({ photoTipsSeen: true }),
      reset: () => set({ completed: false, photoTipsSeen: false }),
    }),
    {
      name: "onboarding-storage",
      storage: createJSONStorage(() => storage),
    },
  ),
);
