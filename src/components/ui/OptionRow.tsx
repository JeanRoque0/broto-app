import React from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";

import { RipplePressable } from "@/components/ui/RipplePressable";
import { theme } from "@/style/theme";
import { fontSize } from "@/style/typography";

import { Text } from "./Text";

type OptionRowProps = {
  label: string;
  description?: string;
  selected: boolean;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
};

export function OptionRow({
  label,
  description,
  selected,
  onPress,
  style,
}: OptionRowProps) {
  return (
    <RipplePressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      style={[styles.row, selected && styles.rowSelected, style]}
    >
      <View style={styles.texts}>
        <Text style={[styles.label, selected && styles.labelSelected]}>
          {label}
        </Text>
        {description && <Text style={styles.description}>{description}</Text>}
      </View>

      <View style={[styles.radio, selected && styles.radioSelected]} />
    </RipplePressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.spacing.s3,
    paddingVertical: 14,
    paddingHorizontal: theme.spacing.s4,
    backgroundColor: theme.surface.card,
    borderWidth: 1.5,
    borderColor: theme.functional.line,
    borderRadius: theme.radius.button,
  },
  rowSelected: {
    borderColor: theme.primary.clay,
    backgroundColor: theme.primary.clayTint,
  },
  texts: {
    flex: 1,
    gap: 2,
  },
  label: {
    fontSize: fontSize.s6,
    color: theme.text.primary,
  },
  labelSelected: {
    fontWeight: "700",
  },
  description: {
    fontSize: fontSize.s3,
    fontStyle: "italic",
    color: theme.text.secondary,
  },
  radio: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.6,
    borderColor: theme.functional.line,
  },
  radioSelected: {
    borderWidth: 5.5,
    borderColor: theme.primary.clay,
  },
});
