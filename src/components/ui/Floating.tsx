import { ReactNode, useEffect } from "react";
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

const RISE = 4;
const PERIOD = 3000;

export function Floating({ children }: { children: ReactNode }) {
  const reduceMotion = useReducedMotion();
  const lift = useSharedValue(0);

  useEffect(() => {
    if (reduceMotion) {
      cancelAnimation(lift);
      lift.value = 0;
      return;
    }

    lift.value = withRepeat(
      withTiming(1, { duration: PERIOD / 2, easing: Easing.inOut(Easing.sin) }),
      -1,
      true,
    );

    return () => cancelAnimation(lift);
  }, [reduceMotion, lift]);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: -RISE * lift.value }],
  }));

  return <Animated.View style={style}>{children}</Animated.View>;
}
