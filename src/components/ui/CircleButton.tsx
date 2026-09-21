import React from "react";
import {
  AccessibilityRole,
  AccessibilityState,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from "react-native";

import { RipplePressable } from "@/components/ui/RipplePressable";
import { theme } from "@/style/theme";

type CircleButtonProps = {
  children: React.ReactNode;
  onPress: () => void;
  tone?: "surface" | "light";
  size?: number;
  accessibilityLabel?: string;
  accessibilityRole?: AccessibilityRole;
  accessibilityState?: AccessibilityState;
  style?: StyleProp<ViewStyle>;
};

export function CircleButton({
  children,
  onPress,
  tone = "surface",
  size = 36,
  accessibilityLabel,
  accessibilityRole = "button",
  accessibilityState,
  style,
}: CircleButtonProps) {
  return (
    <RipplePressable
      onPress={onPress}
      borderless
      radius={size / 2}
      pressScale={0.92}
      accessibilityRole={accessibilityRole}
      accessibilityLabel={accessibilityLabel}
      accessibilityState={accessibilityState}
      hitSlop={8}
      style={[
        styles.base,
        { width: size, height: size, borderRadius: size / 2 },
        tone === "surface" ? styles.surface : styles.light,
        style,
      ]}
    >
      {children}
    </RipplePressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: "center",
    justifyContent: "center",
  },
  surface: {
    backgroundColor: theme.surface.card,
    borderWidth: 1,
    borderColor: theme.functional.line,
  },
  light: {
    backgroundColor: theme.functional.white20,
  },
});
