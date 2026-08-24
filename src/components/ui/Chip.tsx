import React from "react";
import { StyleProp, StyleSheet, TextStyle, View, ViewStyle } from "react-native";

import { RipplePressable } from "@/components/ui/RipplePressable";
import { theme } from "@/style/theme";
import { fontSize } from "@/style/typography";

import { Text } from "./Text";

type ChipTone = "neutral" | "warn" | "ok" | "filled";
type ChipSize = "sm" | "md";

type ChipProps = {
  label: string;
  tone?: ChipTone;
  size?: ChipSize;
  selected?: boolean;
  onPress?: () => void;
  left?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

const toneStyles: Record<ChipTone, { container: ViewStyle; label: TextStyle }> =
  {
    neutral: {
      container: { backgroundColor: theme.surface.containerHigh },
      label: { color: theme.text.secondary },
    },
    warn: {
      container: { backgroundColor: theme.primary.claySoft },
      label: { color: theme.primary.clay },
    },
    ok: {
      container: { backgroundColor: theme.secondary.mossSoft },
      label: { color: theme.secondary.moss },
    },
    filled: {
      container: { backgroundColor: theme.primary.clay },
      label: { color: theme.text.onPrimary },
    },
  };

const sizeStyles: Record<ChipSize, { container: ViewStyle; label: TextStyle }> =
  {
    sm: {
      container: { paddingHorizontal: 8, paddingVertical: 2, gap: 4 },
      label: { fontSize: fontSize.s2 },
    },
    md: {
      container: { paddingHorizontal: 10, paddingVertical: 5, gap: 5 },
      label: { fontSize: fontSize.s2 },
    },
  };

export function Chip({
  label,
  tone = "neutral",
  size = "md",
  selected = false,
  onPress,
  left,
  style,
}: ChipProps) {
  const resolvedTone: ChipTone = onPress && selected ? "warn" : tone;

  const content = (
    <>
      {left}
      <Text
        style={[
          styles.label,
          toneStyles[resolvedTone].label,
          sizeStyles[size].label,
          selected && styles.labelSelected,
        ]}
      >
        {label}
      </Text>
    </>
  );

  const containerStyle = [
    styles.base,
    toneStyles[resolvedTone].container,
    sizeStyles[size].container,
    style,
  ];

  if (!onPress) {
    return <View style={containerStyle}>{content}</View>;
  }

  return (
    <RipplePressable onPress={onPress} style={containerStyle}>
      {content}
    </RipplePressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    borderRadius: theme.radius.pill,
  },
  label: {
    fontWeight: "500",
    includeFontPadding: false,
  },
  labelSelected: {
    fontWeight: "700",
  },
});
