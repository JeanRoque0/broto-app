import React from "react";
import { StyleSheet, View } from "react-native";

import { theme } from "@/style/theme";

export type WaterStatus = "today" | "soon" | "far" | "pending";

const colors: Record<WaterStatus, string> = {
  today: theme.water.today,
  soon: theme.water.soon,
  far: theme.water.far,
  pending: theme.water.pending,
};

type StatusDotProps = {
  status: WaterStatus;
  size?: number;
};

export function StatusDot({ status, size = 6 }: StatusDotProps) {
  return (
    <View
      style={[
        styles.dot,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: colors[status],
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  dot: {
    flexShrink: 0,
  },
});
