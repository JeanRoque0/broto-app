import { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";

import { theme } from "@/style/theme";

const DOT_SIZE = 7;
const STEP_DURATION = 300;
const STAGGER = 150;

export function TypingDots() {
  const dot0 = useRef(new Animated.Value(0)).current;
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const dots = [dot0, dot1, dot2];

    const loop = Animated.loop(
      Animated.parallel(
        dots.map((dot, index) =>
          Animated.sequence([
            Animated.delay(index * STAGGER),
            Animated.timing(dot, {
              toValue: 1,
              duration: STEP_DURATION,
              useNativeDriver: false,
            }),
            Animated.timing(dot, {
              toValue: 0,
              duration: STEP_DURATION,
              useNativeDriver: false,
            }),
            Animated.delay((2 - index) * STAGGER),
          ]),
        ),
      ),
    );

    loop.start();
    return () => loop.stop();
  }, [dot0, dot1, dot2]);

  return (
    <View style={styles.container}>
      {[dot0, dot1, dot2].map((dot, index) => (
        <Animated.View
          key={index}
          style={[
            styles.dot,
            {
              backgroundColor: dot.interpolate({
                inputRange: [0, 1],
                outputRange: [theme.functional.line, theme.secondary.moss],
              }),
              transform: [
                {
                  translateY: dot.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -6],
                  }),
                },
              ],
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    height: 20,
  },
  dot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
  },
});
