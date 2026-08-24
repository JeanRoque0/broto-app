import React from "react";
import { StyleProp, StyleSheet, TextStyle, View, ViewStyle } from "react-native";

import { RipplePressable } from "@/components/ui/RipplePressable";
import { theme } from "@/style/theme";
import { fontSize } from "@/style/typography";

import { Loader } from "./Loader";
import { Text } from "./Text";

type ButtonVariant =
  | "primary"
  | "outline"
  | "ghost"
  | "danger"
  | "light"
  | "social"
  | "dark"
  | "muted";

type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
};

const variantStyles: Record<
  ButtonVariant,
  { container: ViewStyle; label: TextStyle; loader: "clay" | "light" }
> = {
  primary: {
    container: { backgroundColor: theme.primary.clay },
    label: { color: theme.text.onPrimary },
    loader: "light",
  },
  outline: {
    container: {
      backgroundColor: "transparent",
      borderWidth: 1.5,
      borderColor: theme.functional.line,
    },
    label: { color: theme.text.primary },
    loader: "clay",
  },
  ghost: {
    container: { backgroundColor: "transparent" },
    label: { color: theme.text.secondary, fontWeight: "500" },
    loader: "clay",
  },
  danger: {
    container: { backgroundColor: theme.functional.danger },
    label: { color: theme.text.onPrimary },
    loader: "light",
  },
  light: {
    container: { backgroundColor: theme.text.onPrimary },
    label: { color: theme.primary.clay },
    loader: "clay",
  },
  social: {
    container: {
      backgroundColor: theme.surface.card,
      borderWidth: 1.5,
      borderColor: theme.functional.line,
    },
    label: { color: theme.text.primary },
    loader: "clay",
  },
  dark: {
    container: { backgroundColor: theme.text.primary },
    label: { color: theme.text.onDark },
    loader: "light",
  },
  muted: {
    container: { backgroundColor: theme.surface.muted },
    label: { color: theme.text.disabled },
    loader: "clay",
  },
};

const sizeStyles: Record<
  ButtonSize,
  { container: ViewStyle; content: ViewStyle; label: TextStyle }
> = {
  sm: {
    container: {
      paddingVertical: 10,
      paddingHorizontal: theme.spacing.s4,
      borderRadius: theme.radius.field,
    },
    content: { gap: 8 },
    label: { fontSize: fontSize.s4, lineHeight: 18 },
  },
  md: {
    container: {
      paddingVertical: 12,
      paddingHorizontal: 18,
      borderRadius: theme.radius.button,
    },
    content: { gap: 8 },
    label: { fontSize: fontSize.s5, lineHeight: 19 },
  },
  lg: {
    container: {
      paddingVertical: 15,
      paddingHorizontal: theme.spacing.s4,
      borderRadius: theme.radius.button,
    },
    content: { gap: 10 },
    label: { fontSize: fontSize.s7, lineHeight: 21 },
  },
};

export function Button({
  label,
  onPress,
  variant = "primary",
  size = "lg",
  iconLeft,
  iconRight,
  disabled = false,
  loading = false,
  fullWidth = true,
  style,
  labelStyle,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <RipplePressable
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      accessibilityLabel={label}
      rippleColor={theme.functional.ripple}
      style={({ pressed }) => [
        styles.base,
        variantStyles[variant].container,
        sizeStyles[size].container,
        fullWidth && styles.fullWidth,
        disabled && styles.disabled,
        loading && styles.loading,
        pressed && styles.pressed,
        style,
      ]}
    >
      <View
        style={[
          styles.content,
          sizeStyles[size].content,
          loading && styles.contentHidden,
        ]}
      >
        {iconLeft}
        <Text
          style={[
            styles.label,
            variantStyles[variant].label,
            sizeStyles[size].label,
            labelStyle,
          ]}
        >
          {label}
        </Text>
        {iconRight}
      </View>

      {loading && (
        <View style={styles.loaderOverlay} pointerEvents="none">
          <Loader
            style={styles.loaderInline}
            variant={variantStyles[variant].loader}
          />
        </View>
      )}
    </RipplePressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  fullWidth: {
    width: "100%",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  contentHidden: {
    opacity: 0,
  },
  loaderOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
  disabled: {
    opacity: 0.5,
  },
  loading: {
    opacity: 0.8,
  },
  pressed: {
    opacity: 0.9,
  },
  loaderInline: {
    paddingVertical: 0,
  },
  label: {
    fontWeight: "700",
    includeFontPadding: false,
  },
});
