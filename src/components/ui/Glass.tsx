import { BlurView } from "expo-blur";
import React from "react";
import { Platform, StyleProp, StyleSheet, View, ViewStyle } from "react-native";

import { theme } from "@/style/theme";

type GlassProps = {
  tone?: "light" | "dark" | "base";
  intensity?: number;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
};

export function Glass({
  tone = "light",
  intensity = 40,
  style,
  children,
}: GlassProps) {
  if (Platform.OS === "android") {
    return <View style={[FALLBACK[tone], style]}>{children}</View>;
  }

  return (
    <BlurView
      intensity={intensity}
      tint={
        tone === "dark"
          ? "systemUltraThinMaterialDark"
          : "systemChromeMaterialLight"
      }
      style={[styles.base, TINT[tone], style]}
    >
      {children}
    </BlurView>
  );
}

const TINT = {
  light: { backgroundColor: theme.surface.glass },
  dark: { backgroundColor: theme.surface.glassDark },
  base: { backgroundColor: theme.surface.glassBase },
};

const FALLBACK = {
  light: { backgroundColor: theme.surface.glassSolid },
  dark: { backgroundColor: theme.surface.scrim },
  base: { backgroundColor: theme.surface.baseTranslucent },
};

const styles = StyleSheet.create({
  base: {
    overflow: "hidden",
  },
});
