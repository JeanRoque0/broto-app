import React from "react";
import {
  AccessibilityRole,
  AccessibilityState,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from "react-native";

import { Glass } from "@/components/ui/Glass";
import { RipplePressable } from "@/components/ui/RipplePressable";
import { theme } from "@/style/theme";

type CircleButtonProps = {
  children: React.ReactNode;
  onPress: () => void;
  tone?: "surface" | "light" | "glass";
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
        tone === "surface" && styles.surface,
        tone === "light" && styles.light,
        tone === "glass" && styles.glass,
        style,
      ]}
    >
      {tone === "glass" && (
        <Glass
          tone="dark"
          intensity={30}
          style={[StyleSheet.absoluteFill, { borderRadius: size / 2 }]}
        />
      )}
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
  glass: {
    overflow: "hidden",
  },
});
