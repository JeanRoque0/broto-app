import { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";

import { theme } from "@/style/theme";

const FILL_DURATION = 380;
const SEGMENT_GAP = 6;
const DOT_SIZE = 7;
const DOT_ACTIVE_WIDTH = 20;
const DOT_GAP = 7;

type StepProgressProps = {
  total: number;
  current: number;
  style?: StyleProp<ViewStyle>;
};

export function StepProgress({ total, current, style }: StepProgressProps) {
  return (
    <View style={[styles.row, style]}>
      {Array.from({ length: total }, (_, index) => (
        <Segment
          key={index}
          filled={index < current}
          active={index === current - 1}
        />
      ))}
    </View>
  );
}

function Segment({ filled, active }: { filled: boolean; active: boolean }) {
  const fill = useRef(new Animated.Value(filled ? 1 : 0)).current;
  const emphasis = useRef(new Animated.Value(active ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(fill, {
      toValue: filled ? 1 : 0,
      duration: FILL_DURATION,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
      isInteraction: false,
    }).start();
  }, [filled, fill]);

  useEffect(() => {
    Animated.spring(emphasis, {
      toValue: active ? 1 : 0,
      useNativeDriver: false,
      isInteraction: false,
      bounciness: 6,
      speed: 12,
    }).start();
  }, [active, emphasis]);

  return (
    <Animated.View
      style={[
        styles.segment,
        {
          flexGrow: emphasis.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 1.6],
          }),
        },
      ]}
    >
      <Animated.View
        style={[
          styles.segmentFill,
          {
            width: fill.interpolate({
              inputRange: [0, 1],
              outputRange: ["0%", "100%"],
            }),
            opacity: fill.interpolate({
              inputRange: [0, 0.15, 1],
              outputRange: [0, 1, 1],
            }),
          },
        ]}
      />
    </Animated.View>
  );
}

type StepDotsProps = {
  total: number;
  current: number;
  style?: StyleProp<ViewStyle>;
};

export function StepDots({ total, current, style }: StepDotsProps) {
  return (
    <View style={[styles.dotsRow, style]}>
      {Array.from({ length: total }, (_, index) => (
        <Dot key={index} active={index === current - 1} />
      ))}
    </View>
  );
}

function Dot({ active }: { active: boolean }) {
  const emphasis = useRef(new Animated.Value(active ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(emphasis, {
      toValue: active ? 1 : 0,
      useNativeDriver: false,
      isInteraction: false,
      bounciness: 6,
      speed: 12,
    }).start();
  }, [active, emphasis]);

  return (
    <Animated.View
      style={[
        styles.dot,
        {
          width: emphasis.interpolate({
            inputRange: [0, 1],
            outputRange: [DOT_SIZE, DOT_ACTIVE_WIDTH],
          }),
          borderRadius: emphasis.interpolate({
            inputRange: [0, 1],
            outputRange: [DOT_SIZE / 2, 4],
          }),
          backgroundColor: emphasis.interpolate({
            inputRange: [0, 1],
            outputRange: [theme.functional.lineStrong, theme.primary.clay],
          }),
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: SEGMENT_GAP,
  },
  segment: {
    flexBasis: 0,
    height: 3,
    borderRadius: 2,
    backgroundColor: theme.functional.line,
    overflow: "hidden",
  },
  segmentFill: {
    height: "100%",
    borderRadius: 2,
    backgroundColor: theme.primary.clay,
  },
  dotsRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: DOT_GAP,
  },
  dot: {
    height: DOT_SIZE,
  },
  track: {
    height: 5,
    borderRadius: 3,
    backgroundColor: theme.surface.containerHighest,
    overflow: "hidden",
  },
  trackFill: {
    height: "100%",
    borderRadius: 3,
  },
});
