import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  FadeIn,
  FadeOut,
  ReduceMotion,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { Text } from "@/components/ui/Text";
import { theme } from "@/style/theme";
import { type } from "@/style/typography";

const STEP = 4000;
const CREEP = 30000;
const CEILING = 0.92;

export function ReadingStatus() {
  const { t } = useTranslation("analysis");
  const reduceMotion = useReducedMotion();
  const steps = t("readingSteps", {
    returnObjects: true,
  }) as unknown as string[];
  const [index, setIndex] = useState(0);
  const progress = useSharedValue(0);

  useEffect(() => {
    if (index >= steps.length - 1) return;
    const timer = setTimeout(() => setIndex((current) => current + 1), STEP);
    return () => clearTimeout(timer);
  }, [index, steps.length]);

  useEffect(() => {
    progress.set(
      withTiming(CEILING, {
        duration: reduceMotion ? 0 : CREEP,
        easing: Easing.out(Easing.cubic),
      }),
    );
  }, [progress, reduceMotion]);

  const fill = useAnimatedStyle(() => ({
    width: `${progress.get() * 100}%`,
  }));

  return (
    <View style={styles.wrap}>
      <View style={styles.line} accessibilityLiveRegion="polite">
        <Animated.View
          key={index}
          entering={FadeIn.duration(320).reduceMotion(ReduceMotion.System)}
          exiting={FadeOut.duration(200).reduceMotion(ReduceMotion.System)}
        >
          <Text family="display" style={styles.step}>
            {steps[index]}
          </Text>
        </Animated.View>
      </View>

      <View
        style={styles.track}
        accessibilityRole="progressbar"
        accessibilityLabel={steps[index]}
      >
        <Animated.View style={[styles.fill, fill]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignSelf: "stretch",
    alignItems: "center",
    marginTop: theme.spacing.s6,
    gap: theme.spacing.s4,
  },
  line: {
    minHeight: 30,
    justifyContent: "center",
  },
  step: {
    ...type.displayXs,
    textAlign: "center",
  },
  track: {
    width: "70%",
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
    backgroundColor: theme.functional.line,
  },
  fill: {
    height: "100%",
    borderRadius: 3,
    backgroundColor: theme.primary.clay,
  },
});
