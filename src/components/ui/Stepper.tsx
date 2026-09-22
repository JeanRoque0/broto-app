import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";

import { RipplePressable } from "@/components/ui/RipplePressable";
import i18n from "@/i18n";
import { theme } from "@/style/theme";
import { fontSize } from "@/style/typography";

import { Text } from "./Text";

type StepperProps = {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  format?: (value: number) => string;
  label?: string;
  style?: StyleProp<ViewStyle>;
};

export function Stepper({
  value,
  onChange,
  min = 1,
  max = 365,
  step = 1,
  format = (v) => String(v),
  label,
  style,
}: StepperProps) {
  const canDecrement = value - step >= min;
  const canIncrement = value + step <= max;

  function shift(delta: number) {
    const next = value + delta;
    if (next < min || next > max) return;
    onChange(next);
  }

  return (
    <View
      style={[styles.container, style]}
      accessible
      accessibilityRole="adjustable"
      accessibilityLabel={label}
      accessibilityValue={{ text: format(value) }}
      accessibilityActions={[
        { name: "increment", label: i18n.t("increase") },
        { name: "decrement", label: i18n.t("decrease") },
      ]}
      onAccessibilityAction={(event) =>
        shift(event.nativeEvent.actionName === "increment" ? step : -step)
      }
    >
      <RipplePressable
        onPress={() => shift(-step)}
        disabled={!canDecrement}
        pressScale={0.9}
        accessibilityRole="button"
        accessibilityLabel={i18n.t("decrease")}
        style={[styles.button, !canDecrement && styles.buttonDisabled]}
      >
        <Feather name="minus" size={17} color={theme.text.primary} />
      </RipplePressable>

      <Text family="mono" style={styles.value}>
        {format(value)}
      </Text>

      <RipplePressable
        onPress={() => shift(step)}
        disabled={!canIncrement}
        pressScale={0.9}
        accessibilityRole="button"
        accessibilityLabel={i18n.t("increase")}
        style={[styles.button, !canIncrement && styles.buttonDisabled]}
      >
        <Feather name="plus" size={17} color={theme.text.primary} />
      </RipplePressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.s4,
    paddingVertical: theme.spacing.s2,
    paddingHorizontal: theme.spacing.s3,
    backgroundColor: theme.surface.card,
    borderWidth: 1.5,
    borderColor: theme.functional.line,
    borderRadius: theme.radius.field,
  },
  button: {
    width: 34,
    height: 34,
    borderRadius: 9,
    backgroundColor: theme.surface.container,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  value: {
    flex: 1,
    textAlign: "center",
    fontSize: fontSize.s7,
    fontWeight: "500",
    color: theme.text.primary,
  },
});
