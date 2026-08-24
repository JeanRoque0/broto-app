import React, { useRef, useState } from "react";
import {
  Animated,
  GestureResponderEvent,
  LayoutChangeEvent,
  Platform,
  Pressable,
  PressableProps,
  StyleSheet,
} from "react-native";

import { theme } from "@/style/theme";

type RipplePressableProps = Omit<PressableProps, "android_ripple"> & {
  rippleColor?: string;
  borderless?: boolean;
  radius?: number;
};

export function RipplePressable({
  rippleColor = theme.functional.ripple,
  borderless = false,
  radius,
  style,
  children,
  onPressIn,
  onPressOut,
  onLayout,
  ...props
}: RipplePressableProps) {
  const scale = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const [origin, setOrigin] = useState({ x: 0, y: 0 });
  const [rippleSize, setRippleSize] = useState(0);

  function handleLayout(e: LayoutChangeEvent) {
    const { width, height } = e.nativeEvent.layout;
    setRippleSize(Math.ceil(Math.sqrt(width ** 2 + height ** 2) * 2));
    onLayout?.(e);
  }

  function handlePressIn(e: GestureResponderEvent) {
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

  return (
    <Pressable
      android_ripple={{
        color: rippleColor,
        borderless,
        radius,
        foreground: true,
      }}
      style={(state) => [
        typeof style === "function" ? style(state) : style,
        { overflow: "hidden" },
      ]}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onLayout={handleLayout}
      {...props}
    >
      {(state) => (
        <>
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
        </>
      )}
    </Pressable>
  );
}
