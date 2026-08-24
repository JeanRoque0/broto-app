import React from "react";
import { StyleProp, StyleSheet, ViewStyle } from "react-native";

import { RipplePressable } from "@/components/ui/RipplePressable";
import { theme } from "@/style/theme";

type CircleButtonProps = {
  children: React.ReactNode;
  onPress: () => void;
  tone?: "surface" | "light";
  size?: number;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
};

export function CircleButton({
  children,
  onPress,
  tone = "surface",
  size = 36,
  accessibilityLabel,
  style,
}: CircleButtonProps) {
  return (
    <RipplePressable
      onPress={onPress}
      borderless
      radius={size / 2}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
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
