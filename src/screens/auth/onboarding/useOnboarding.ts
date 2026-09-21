import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import Animated, {
  runOnJS,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";

import { useOnboardingStore } from "@/store";

import { SLIDES } from "./slides";

export function useOnboarding() {
  const router = useRouter();
  const complete = useOnboardingStore((state) => state.complete);
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollX = useSharedValue(0);
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
  }, [isLast, finish, index, width, scrollRef]);

  const handleScroll = useAnimatedScrollHandler(
    (event) => {
      scrollX.value = event.contentOffset.x;
      if (!width) return;
      const next = Math.round(event.contentOffset.x / width);
      if (next !== index) runOnJS(setIndex)(next);
    },
    [width, index],
  );

  return {
    slides: SLIDES,
    scrollRef,
    scrollX,
    index,
    width,
    setWidth,
    isLast,
    handleNext,
    handleScroll,
    handleSkip: finish,
  };
}
