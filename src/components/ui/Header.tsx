import { useRouter } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";

import { BackIcon } from "@/components/ui/BackIcon";
import { CircleButton } from "@/components/ui/CircleButton";
import { theme } from "@/style/theme";
import { fontSize } from "@/style/typography";

import { Text } from "./Text";

type HeaderProps = {
  showBack?: boolean;
  onBack?: () => void;
  title?: string;
  center?: React.ReactNode;
  rightAction?: React.ReactNode;
  border?: boolean;
  style?: StyleProp<ViewStyle>;
};

const SLOT_WIDTH = 36;
const CENTER_INSET = 92;

export function Header({
  showBack = false,
  onBack,
  title,
  center,
  rightAction,
  border = false,
  style,
}: HeaderProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const handleBack = onBack ?? (() => router.back());

  return (
    <View style={[styles.base, border && styles.bordered, style]}>
      <View style={styles.slot}>
        {showBack && (
          <CircleButton onPress={handleBack} accessibilityLabel={t("back")}>
            <BackIcon />
          </CircleButton>
        )}
      </View>

      <View style={styles.center} pointerEvents="box-none">
        {center ??
          (title ? (
            <Text style={styles.title} numberOfLines={1}>
              {title}
            </Text>
          ) : null)}
      </View>

      <View style={styles.spacer} />

      <View style={styles.slot}>{rightAction}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.s5,
    paddingTop: theme.spacing.s2,
    paddingBottom: theme.spacing.s4,
    gap: theme.spacing.s3,
  },
  bordered: {
    borderBottomWidth: 1,
    borderBottomColor: theme.functional.line,
  },
  slot: {
    minWidth: SLOT_WIDTH,
    alignItems: "center",
  },
  center: {
    position: "absolute",
    left: CENTER_INSET,
    right: CENTER_INSET,
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  spacer: {
    flex: 1,
  },
  title: {
    fontSize: fontSize.s7,
    fontWeight: "700",
    color: theme.text.primary,
    textAlign: "center",
  },
});
