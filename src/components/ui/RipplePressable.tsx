import React, { useState } from "react";
import {
  Animated,
  GestureResponderEvent,
  LayoutChangeEvent,
  Platform,
  Pressable,
  PressableProps,
  PressableStateCallbackType,
  StyleSheet,
} from "react-native";
import { useReducedMotion } from "react-native-reanimated";

import { theme } from "@/style/theme";
import { haptic } from "@/utils/haptics";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type RipplePressableProps = Omit<PressableProps, "android_ripple"> & {
  rippleColor?: string;
  borderless?: boolean;
  radius?: number;
  pressScale?: number;
};

export function RipplePressable({
  rippleColor = theme.functional.ripple,
  borderless = false,
  radius,
  pressScale,
  style,
  children,
  onPressIn,
  onPressOut,
  onPress,
  onLayout,
  ...props
}: RipplePressableProps) {
  const scale = useState(() => new Animated.Value(0))[0];
  const opacity = useState(() => new Animated.Value(0))[0];
  const squeeze = useState(() => new Animated.Value(1))[0];
  const [origin, setOrigin] = useState({ x: 0, y: 0 });
  const [rippleSize, setRippleSize] = useState(0);
  const [pressed, setPressed] = useState(false);
  const reduceMotion = useReducedMotion();

  const squeezes = !!pressScale && !reduceMotion;

  function handleLayout(e: LayoutChangeEvent) {
    const { width, height } = e.nativeEvent.layout;
    setRippleSize(Math.ceil(Math.sqrt(width ** 2 + height ** 2) * 2));
    onLayout?.(e);
  }

  function handlePressIn(e: GestureResponderEvent) {
    setPressed(true);

    if (squeezes) {
      Animated.spring(squeeze, {
        toValue: pressScale!,
        speed: 40,
        bounciness: 0,
        useNativeDriver: true,
      }).start();
    }

    if (Platform.OS === "ios") {
      const { locationX, locationY } = e.nativeEvent;
      setOrigin({ x: locationX, y: locationY });
      scale.setValue(0);
      opacity.setValue(1);
      Animated.timing(scale, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
        isInteraction: false,
      }).start();
    }
    onPressIn?.(e);
  }

  function handlePressOut(e: GestureResponderEvent) {
    setPressed(false);

    if (squeezes) {
      Animated.spring(squeeze, {
        toValue: 1,
        speed: 18,
        bounciness: 0,
        useNativeDriver: true,
      }).start();
    }

    if (Platform.OS === "ios") {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
        isInteraction: false,
      }).start();
    }
    onPressOut?.(e);
  }

  function handlePress(e: GestureResponderEvent) {
    haptic.tap();
    onPress?.(e);
  }

  const state: PressableStateCallbackType = { pressed, hovered: false };
  const resolved = typeof style === "function" ? style(state) : style;

  return (
    <AnimatedPressable
      onPress={onPress ? handlePress : undefined}
      android_ripple={{
        color: rippleColor,
        borderless,
        radius,
        foreground: true,
      }}
      style={[
        resolved,
        { overflow: "hidden" },
        squeezes && { transform: [{ scale: squeeze }] },
      ]}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onLayout={handleLayout}
      {...props}
    >
      {typeof children === "function" ? children(state) : children}
      {Platform.OS === "ios" && (
        <Animated.View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFill,
            {
              overflow: "hidden",
              borderRadius: borderless && radius != null ? radius : 0,
            },
          ]}
        >
          <Animated.View
            style={{
              position: "absolute",
              width: rippleSize,
              height: rippleSize,
              borderRadius: rippleSize / 2,
              backgroundColor: rippleColor,
              left: origin.x - rippleSize / 2,
              top: origin.y - rippleSize / 2,
              opacity,
              transform: [{ scale }],
            }}
          />
        </Animated.View>
      )}
    </AnimatedPressable>
  );
}
