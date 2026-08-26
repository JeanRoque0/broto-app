import { Feather } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { useTranslation } from "react-i18next";
import { StyleProp, StyleSheet, TextStyle, View } from "react-native";

import { RipplePressable } from "@/components/ui/RipplePressable";
import { Text } from "@/components/ui/Text";
import { Toast } from "@/components/ui/Toast";
import { FontFamily } from "@/style/typography";
import { theme } from "@/style/theme";

type CopyableNameProps = {
  label: string;
  common?: string | null;
  scientific?: string | null;
  family?: FontFamily;
  textStyle?: StyleProp<TextStyle>;
};

export function CopyableName({
  label,
  common,
  scientific,
  family = "display",
  textStyle,
}: CopyableNameProps) {
  const { t } = useTranslation("analysis");

  const {
    margin,
    marginTop,
    marginBottom,
    marginLeft,
    marginRight,
    marginHorizontal,
    marginVertical,
    ...type
  } = StyleSheet.flatten(textStyle) ?? {};

  const outer = Object.fromEntries(
    Object.entries({
      margin,
      marginTop,
      marginBottom,
      marginLeft,
      marginRight,
      marginHorizontal,
      marginVertical,
    }).filter(([, value]) => value !== undefined),
  );

  const size = Math.round((type.fontSize ?? 20) * 0.62);
  const color = (type.color as string) ?? theme.text.primary;

  async function copy() {
    const lines = [
      common && `${t("copyCommonLabel")}: ${common}`,
      scientific && `${t("copySpeciesLabel")}: ${scientific}`,
    ].filter(Boolean);

    if (lines.length === 0) return;

    await Clipboard.setStringAsync(lines.join("\n"));
    Toast.show({ text: t("copied") });
  }

  return (
    <RipplePressable
      onPress={copy}
      style={[styles.row, outer]}
      accessibilityRole="button"
      accessibilityLabel={t("copyAction")}
    >
      <Text family={family} style={[styles.label, type]}>
        {label}
      </Text>

      <View
        style={[
          styles.icon,
          { height: type.lineHeight ?? type.fontSize ?? size },
        ]}
      >
        <Feather name="copy" size={size} color={color} />
      </View>
    </RipplePressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: theme.spacing.s2,
    marginLeft: -theme.spacing.s2,
    paddingHorizontal: theme.spacing.s2,
    borderRadius: theme.radius.sm,
  },
  label: {
    flexShrink: 1,
  },
  icon: {
    opacity: 0.55,
    justifyContent: "center",
  },
});
