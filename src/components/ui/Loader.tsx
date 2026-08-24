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

const DOT_SIZE = 8;
const ORBIT_RADIUS = 8;
const DEPTH_SCALE = 0.35;
const SPIN_DURATION = 1000;
const SAMPLE_COUNT = 24;

const TRACK_WIDTH = ORBIT_RADIUS * 2 + DOT_SIZE;
const TRACK_HEIGHT = Math.ceil(DOT_SIZE * (1 + DEPTH_SCALE));

const spinProgress = Array.from(
  { length: SAMPLE_COUNT + 1 },
  (_, index) => index / SAMPLE_COUNT,
);
const spinAngles = spinProgress.map((progress) => progress * Math.PI * 2);

const horizontalOffset = spinAngles.map((angle) => ORBIT_RADIUS * Math.cos(angle));
const horizontalOffsetOpposite = horizontalOffset.map((offset) => -offset);
const depthScale = spinAngles.map((angle) => 1 + DEPTH_SCALE * Math.sin(angle));
const depthScaleOpposite = spinAngles.map(
  (angle) => 1 - DEPTH_SCALE * Math.sin(angle),
);

type LoaderProps = {
  style?: StyleProp<ViewStyle>;
  variant?: "clay" | "light";
};

export function Loader({ style, variant = "clay" }: LoaderProps = {}) {
  const spin = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: SPIN_DURATION,
        easing: Easing.linear,
        useNativeDriver: true,
        isInteraction: false,
      }),
    );

    loop.start();
    return () => loop.stop();
  }, [spin]);

  const leadColor =
    variant === "light" ? theme.text.onPrimary : theme.primary.clay;
  const trailColor =
    variant === "light" ? theme.functional.white55 : theme.functional.lineStrong;

  return (
    <View style={[styles.container, style]}>
      <View style={styles.track}>
        <Animated.View
          style={[
            styles.dot,
            {
              backgroundColor: leadColor,
              transform: [
                {
                  translateX: spin.interpolate({
                    inputRange: spinProgress,
                    outputRange: horizontalOffset,
                  }),
                },
                {
                  scale: spin.interpolate({
                    inputRange: spinProgress,
                    outputRange: depthScale,
                  }),
                },
              ],
            },
          ]}
        />

        <Animated.View
          style={[
            styles.dot,
            {
              backgroundColor: trailColor,
              transform: [
                {
                  translateX: spin.interpolate({
                    inputRange: spinProgress,
                    outputRange: horizontalOffsetOpposite,
                  }),
                },
                {
                  scale: spin.interpolate({
                    inputRange: spinProgress,
                    outputRange: depthScaleOpposite,
                  }),
                },
              ],
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: theme.spacing.s4,
  },
  track: {
    width: TRACK_WIDTH,
    height: TRACK_HEIGHT,
  },
  dot: {
    position: "absolute",
    top: (TRACK_HEIGHT - DOT_SIZE) / 2,
    left: (TRACK_WIDTH - DOT_SIZE) / 2,
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
  },
});
