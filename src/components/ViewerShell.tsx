import { Feather } from "@expo/vector-icons";
import React, { useCallback, useEffect } from "react";
import {
  BackHandler,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Easing,
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { CircleButton } from "@/components/ui/CircleButton";
import { Glass } from "@/components/ui/Glass";
import { Text } from "@/components/ui/Text";
import { theme } from "@/style/theme";
import { fontSize } from "@/style/typography";

const OPEN = 280;
const CLOSE = 180;
const DISMISS_DISTANCE = 120;
const DISMISS_SPEED = 900;

type ViewerShellProps = {
  onClose: () => void;
  closeLabel: string;
  counter?: string;
  draggable: boolean;
  footer?: React.ReactNode;
  children: React.ReactNode;
};

export function ViewerShell({
  onClose,
  closeLabel,
  counter,
  draggable,
  footer,
  children,
}: ViewerShellProps) {
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const reduceMotion = useReducedMotion();
  const appear = useSharedValue(0);
  const drag = useSharedValue(0);

  useEffect(() => {
    appear.set(
      withTiming(1, {
        duration: reduceMotion ? 0 : OPEN,
        easing: Easing.out(Easing.cubic),
      }),
    );
  }, [appear, reduceMotion]);

  const dismiss = useCallback(() => {
    appear.set(
      withTiming(
        0,
        { duration: reduceMotion ? 0 : CLOSE, easing: Easing.in(Easing.cubic) },
        (finished) => {
          if (finished) runOnJS(onClose)();
        },
      ),
    );
  }, [appear, onClose, reduceMotion]);

  useEffect(() => {
    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        dismiss();
        return true;
      },
    );
    return () => subscription.remove();
  }, [dismiss]);

  const pan = Gesture.Pan()
    .enabled(draggable)
    .activeOffsetY([-12, 12])
    .failOffsetX([-16, 16])
    .onUpdate((event) => {
      drag.set(event.translationY);
    })
    .onEnd((event) => {
      const far = Math.abs(event.translationY) > DISMISS_DISTANCE;
      const fast = Math.abs(event.velocityY) > DISMISS_SPEED;
      if (far || fast) {
        runOnJS(dismiss)();
        return;
      }
      drag.set(withTiming(0, { duration: 200 }));
    });

  const backdropStyle = useAnimatedStyle(() => ({
    opacity:
      appear.get() *
      interpolate(
        Math.abs(drag.get()),
        [0, height * 0.5],
        [1, 0.25],
        Extrapolation.CLAMP,
      ),
  }));

  const stageStyle = useAnimatedStyle(() => ({
    opacity: appear.get(),
    transform: [
      { translateY: drag.get() },
      {
        scale:
          (0.94 + 0.06 * appear.get()) *
          interpolate(
            Math.abs(drag.get()),
            [0, height],
            [1, 0.82],
            Extrapolation.CLAMP,
          ),
      },
    ],
  }));

  const chromeStyle = useAnimatedStyle(() => ({
    opacity:
      appear.get() *
      interpolate(Math.abs(drag.get()), [0, 90], [1, 0], Extrapolation.CLAMP),
  }));

  return (
    <View style={StyleSheet.absoluteFill}>
      <Animated.View style={[styles.backdrop, backdropStyle]} />

      <GestureDetector gesture={pan}>
        <Animated.View style={[styles.stage, stageStyle]}>
          {children}
        </Animated.View>
      </GestureDetector>

      <Animated.View
        style={[StyleSheet.absoluteFill, chromeStyle]}
        pointerEvents="box-none"
      >
        {footer}

        <View
          style={[styles.topbar, { top: insets.top + theme.spacing.s3 }]}
          pointerEvents="box-none"
        >
          <CircleButton
            onPress={dismiss}
            tone="glass"
            accessibilityLabel={closeLabel}
          >
            <Feather name="x" size={18} color={theme.text.onDark} />
          </CircleButton>

          {counter ? (
            <Glass tone="dark" intensity={30} style={styles.counter}>
              <Text style={styles.counterText}>{counter}</Text>
            </Glass>
          ) : null}

          <View style={styles.spacer} />
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: theme.surface.dark,
  },
  stage: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  topbar: {
    position: "absolute",
    left: theme.screenPadding,
    right: theme.screenPadding,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  counter: {
    paddingVertical: 6,
    paddingHorizontal: theme.spacing.s3,
    borderRadius: theme.radius.pill,
  },
  counterText: {
    fontSize: fontSize.s4,
    fontWeight: "700",
    color: theme.text.onDark,
  },
  spacer: {
    width: 36,
  },
});
