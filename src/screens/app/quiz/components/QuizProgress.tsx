import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { theme } from "@/style/theme";

type QuizProgressProps = {
  step: number;
  total: number;
  label: string;
};

export function QuizProgress({ step, total, label }: QuizProgressProps) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.set(
      withTiming(total > 0 ? step / total : 0, {
        duration: 420,
        easing: Easing.bezier(0.22, 1, 0.36, 1),
        reduceMotion: ReduceMotion.System,
      }),
    );
  }, [progress, step, total]);

  const fill = useAnimatedStyle(() => ({
    width: `${progress.get() * 100}%`,
  }));

  return (
    <View
      style={styles.track}
      accessibilityRole="progressbar"
      accessibilityLabel={label}
      accessibilityValue={{ min: 0, max: total, now: step }}
    >
      <Animated.View style={[styles.fill, fill]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
    backgroundColor: theme.functional.line,
  },
  fill: {
    height: "100%",
    borderRadius: 3,
    backgroundColor: theme.secondary.moss,
  },
});
