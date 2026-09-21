import { useFocusEffect } from "expo-router";
import { useCallback } from "react";

import { useOnboardingStore } from "@/store/onboardingStore";

import { hasAnchor } from "./registry";
import { TourStep, useTourStore } from "./tourStore";

const SETTLE = 700;

export function useTour(id: string, steps: TourStep[], ready: boolean) {
  const seen = useOnboardingStore((state) => state.toursSeen.includes(id));
  const start = useTourStore((state) => state.start);

  useFocusEffect(
    useCallback(() => {
      if (seen || !ready) return;

      const timer = setTimeout(
        () => start(id, steps.filter((step) => hasAnchor(step.anchor))),
        SETTLE,
      );
      return () => clearTimeout(timer);
    }, [seen, ready, start, id, steps]),
  );
}
