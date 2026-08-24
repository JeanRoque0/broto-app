import { useEffect } from "react";
import { AppState } from "react-native";

import { useLanguageStore } from "@/store";

export function useSystemLanguage() {
  const syncFromSystem = useLanguageStore((state) => state.syncFromSystem);

  useEffect(() => {
    syncFromSystem();

    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") syncFromSystem();
    });

    return () => subscription.remove();
  }, [syncFromSystem]);
}
