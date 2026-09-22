import { Feather } from "@expo/vector-icons";
import { useEffect } from "react";
import { StyleSheet } from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { theme } from "@/style/theme";

const SIZE = 26;

export function CheckPop({ checked }: { checked: boolean }) {
  const reduceMotion = useReducedMotion();
  const fill = useSharedValue(checked ? 1 : 0);

  useEffect(() => {
    fill.set(withTiming(checked ? 1 : 0, { duration: reduceMotion ? 0 : 180 }));
  }, [checked, reduceMotion, fill]);

  const circle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      fill.get(),
      [0, 1],
      [theme.surface.card, theme.secondary.moss],
    ),
    borderColor: interpolateColor(
      fill.get(),
      [0, 1],
      [theme.functional.lineStrong, theme.secondary.moss],
    ),
  }));

  const mark = useAnimatedStyle(() => ({
    opacity: fill.get(),
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
