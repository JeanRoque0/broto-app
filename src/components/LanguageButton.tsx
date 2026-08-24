import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import { StyleProp, StyleSheet, ViewStyle } from "react-native";

import { LanguageSheet } from "@/components/LanguageSheet";
import { RipplePressable } from "@/components/ui/RipplePressable";
import { Text } from "@/components/ui/Text";
import { LANGUAGES } from "@/constants/languages";
import { useLanguageStore } from "@/store";
import { theme } from "@/style/theme";
import { fontSize } from "@/style/typography";

type LanguageButtonProps = {
  style?: StyleProp<ViewStyle>;
};

export function LanguageButton({ style }: LanguageButtonProps) {
  const [sheetVisible, setSheetVisible] = useState(false);
  const current = useLanguageStore((state) => state.current);
  const language = LANGUAGES.find((item) => item.code === current);

  return (
    <>
      <RipplePressable
        onPress={() => setSheetVisible(true)}
        accessibilityRole="button"
        accessibilityLabel={language?.nativeLabel}
        style={[styles.button, style]}
      >
        <Feather name="globe" size={14} color={theme.text.secondary} />
        <Text family="mono" style={styles.label}>
          {language?.label}
        </Text>
      </RipplePressable>

      <LanguageSheet
        visible={sheetVisible}
        onClose={() => setSheetVisible(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: theme.spacing.s3,
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    borderColor: theme.functional.line,
    backgroundColor: theme.surface.card,
  },
  label: {
    fontSize: fontSize.s2,
    color: theme.text.secondary,
  },
});
