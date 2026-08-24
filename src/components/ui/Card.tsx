import React from "react";
import {
  AccessibilityRole,
  AccessibilityState,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";

import { RipplePressable } from "@/components/ui/RipplePressable";
import { theme } from "@/style/theme";

type CardProps = {
  children: React.ReactNode;
  accent?: string;
  onPress?: () => void;
  accessibilityRole?: AccessibilityRole;
  accessibilityState?: AccessibilityState;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
};

export function Card({
  children,
  accent,
  onPress,
  accessibilityRole,
  accessibilityState,
  accessibilityLabel,
  style,
}: CardProps) {
  const cardStyle = [
    styles.card,
    accent ? { borderLeftWidth: 3, borderLeftColor: accent } : null,
    style,
  ];

  if (!onPress) {
    return <View style={cardStyle}>{children}</View>;
  }

  return (
    <RipplePressable
      onPress={onPress}
      style={cardStyle}
      accessibilityRole={accessibilityRole}
      accessibilityState={accessibilityState}
      accessibilityLabel={accessibilityLabel}
    >
      {children}
    </RipplePressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.surface.card,
    borderWidth: 1,
    borderColor: theme.functional.line,
    borderRadius: theme.radius.md,
    padding: theme.spacing.s4,
  },
});
