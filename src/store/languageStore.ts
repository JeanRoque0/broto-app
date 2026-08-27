import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { detectDeviceLanguage, LanguageCode } from "@/constants/languages";
import i18n from "@/i18n";

import storage from "./storage";

interface LanguageState {
  chosen: LanguageCode | null;
  current: LanguageCode;
  setLanguage: (code: LanguageCode) => void;
  followSystem: () => void;
  syncFromSystem: () => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set, get) => ({
      chosen: null,
      current: detectDeviceLanguage(),

      setLanguage: (code) => {
        i18n.changeLanguage(code);
        set({ chosen: code, current: code });
      },

      followSystem: () => {
        const detected = detectDeviceLanguage();
        i18n.changeLanguage(detected);
        set({ chosen: null, current: detected });
      },

      syncFromSystem: () => {
        if (get().chosen) return;

        const detected = detectDeviceLanguage();
        if (detected === get().current && i18n.language === detected) return;

        i18n.changeLanguage(detected);
        set({ current: detected });
      },
    }),
    {
      name: "language-storage",
      storage: createJSONStorage(() => storage),
      partialize: ({ chosen }) => ({ chosen }),
      onRehydrateStorage: () => (state) => {
        const resolved = state?.chosen ?? detectDeviceLanguage();
        i18n.changeLanguage(resolved);
        useLanguageStore.setState({ current: resolved });
      },
    },
  ),
);
