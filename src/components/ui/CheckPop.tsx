import { Feather } from "@expo/vector-icons";
import { useEffect, useRef } from "react";
import { StyleSheet } from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import { theme } from "@/style/theme";

const SIZE = 26;

export function CheckPop({ checked }: { checked: boolean }) {
  const reduceMotion = useReducedMotion();
  const fill = useSharedValue(checked ? 1 : 0);
  const scale = useSharedValue(1);
  const was = useRef(checked);

  useEffect(() => {
    const turnedOn = checked && !was.current;
    was.current = checked;

    fill.value = withTiming(checked ? 1 : 0, { duration: reduceMotion ? 0 : 180 });

    if (turnedOn && !reduceMotion) {
      scale.value = withSequence(
        withTiming(1.28, { duration: 120 }),
        withSpring(1, { damping: 9, stiffness: 260 }),
      );
    }
  }, [checked, reduceMotion, fill, scale]);

  const circle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      fill.value,
      [0, 1],
      [theme.surface.card, theme.secondary.moss],
    ),
    borderColor: interpolateColor(
      fill.value,
      [0, 1],
      [theme.functional.lineStrong, theme.secondary.moss],
    ),
    transform: [{ scale: scale.value }],
  }));

  const mark = useAnimatedStyle(() => ({
    opacity: fill.value,
    transform: [{ scale: 0.6 + fill.value * 0.4 }],
  }));

  return (
    <Animated.View style={[styles.circle, circle]}>
      <Animated.View style={mark}>
        <Feather name="check" size={15} color={theme.text.onPrimary} />
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  circle: {
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
});
