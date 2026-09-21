import { useEffect } from "react";
import Animated, {
  cancelAnimation,
  Easing,
  interpolate,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

import { styles } from "../style";

const BREATH = 1800;

export function GuideFrame() {
  const reduceMotion = useReducedMotion();
  const breath = useSharedValue(0);

  useEffect(() => {
    if (reduceMotion) {
      cancelAnimation(breath);
      breath.value = 0;
      return;
    }

    breath.value = withRepeat(
      withTiming(1, { duration: BREATH, easing: Easing.inOut(Easing.sin) }),
      -1,
      true,
    );

    return () => cancelAnimation(breath);
  }, [reduceMotion, breath]);

  const style = useAnimatedStyle(() => ({
    opacity: interpolate(breath.value, [0, 1], [1, 0.55]),
    transform: [{ scale: interpolate(breath.value, [0, 1], [1, 1.015]) }],
  }));

  return <Animated.View style={[styles.guide, style]} pointerEvents="none" />;
}
