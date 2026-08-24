import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";

import { RipplePressable } from "@/components/ui/RipplePressable";
import { theme } from "@/style/theme";
import { fontSize } from "@/style/typography";

import { Text } from "./Text";

type RowProps = {
  label: string;
  value?: string;
  valueColor?: string;
  mono?: boolean;
  right?: React.ReactNode;
  last?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function Row({
  label,
  value,
  valueColor,
  mono = false,
  right,
  last = false,
  style,
}: RowProps) {
  return (
    <View style={[styles.row, last && styles.rowLast, style]}>
      <Text style={styles.label}>{label}</Text>
      {right ??
        (value ? (
          <Text
            family={mono ? "mono" : "sans"}
            style={[styles.value, valueColor ? { color: valueColor } : null]}
          >
            {value}
          </Text>
        ) : null)}
    </View>
  );
}

type MenuRowProps = {
  label: string;
  description?: string;
  hint?: string;
  icon?: React.ComponentProps<typeof Feather>["name"];
  onPress?: () => void;
  right?: React.ReactNode;
  danger?: boolean;
  last?: boolean;
};

export function MenuRow({
  label,
  description,
  hint,
  icon,
  onPress,
  right,
  danger = false,
  last = false,
}: MenuRowProps) {
  const color = danger ? theme.functional.danger : theme.text.primary;

  const content = (
    <>
      {icon && (
        <Feather
          name={icon}
          size={18}
          color={danger ? theme.functional.danger : theme.text.secondary}
        />
      )}
      <View style={styles.menuTexts}>
        <Text style={[styles.menuLabel, { color }]}>{label}</Text>
        {description && (
          <Text style={styles.menuDescription}>{description}</Text>
        )}
      </View>

      {hint && <Text style={styles.menuHint}>{hint}</Text>}
      {right ??
        (onPress ? (
          <Feather
            name="chevron-right"
            size={18}
            color={theme.text.secondary}
          />
        ) : null)}
    </>
  );

  if (!onPress) {
    return (
      <View style={[styles.menuRow, last && styles.rowLast]}>{content}</View>
    );
  }

  return (
    <RipplePressable
      onPress={onPress}
      style={[styles.menuRow, last && styles.rowLast]}
    >
      {content}
    </RipplePressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.spacing.s3,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: theme.functional.line,
  },
  rowLast: {
    borderBottomWidth: 0,
  },
  label: {
    fontSize: fontSize.s5,
    color: theme.text.secondary,
  },
  value: {
    fontSize: fontSize.s5,
    fontWeight: "500",
    color: theme.text.primary,
    flexShrink: 1,
    textAlign: "right",
  },
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.s4,
    paddingVertical: 15,
    paddingHorizontal: theme.spacing.s4,
    borderBottomWidth: 1,
    borderBottomColor: theme.functional.line,
  },
  menuTexts: {
    flex: 1,
    gap: 2,
  },
  menuLabel: {
    fontSize: fontSize.s6,
  },
  menuDescription: {
    fontSize: fontSize.s4,
    color: theme.text.secondary,
  },
  menuHint: {
    flexShrink: 1,
    fontSize: fontSize.s4,
    color: theme.text.secondary,
    textAlign: "right",
  },
});
