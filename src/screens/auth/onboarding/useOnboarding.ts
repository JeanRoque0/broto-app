import { useRouter } from "expo-router";
import { useCallback, useRef, useState } from "react";
import { NativeScrollEvent, NativeSyntheticEvent, ScrollView } from "react-native";

import { useOnboardingStore } from "@/store";

import { SLIDES } from "./slides";

export function useOnboarding() {
  const router = useRouter();
  const complete = useOnboardingStore((state) => state.complete);
  const scrollRef = useRef<ScrollView>(null);
  const [index, setIndex] = useState(0);
  const [width, setWidth] = useState(0);

  const isLast = index === SLIDES.length - 1;

  const finish = useCallback(() => {
    complete();
    router.replace("/(auth)/welcome");
  }, [complete, router]);

  const handleNext = useCallback(() => {
    if (isLast) {
      finish();
      return;
    }
    scrollRef.current?.scrollTo({ x: (index + 1) * width, animated: true });
  }, [isLast, finish, index, width]);

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (!width) return;
      setIndex(Math.round(event.nativeEvent.contentOffset.x / width));
    },
    [width],
  );

  return {
    slides: SLIDES,
    scrollRef,
    index,
    width,
    setWidth,
    isLast,
    handleNext,
    handleScroll,
    handleSkip: finish,
  };
}
