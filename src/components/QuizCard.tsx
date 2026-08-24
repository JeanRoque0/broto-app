import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { RipplePressable } from "@/components/ui/RipplePressable";
import { Text } from "@/components/ui/Text";
import { theme } from "@/style/theme";
import { fontSize, type } from "@/style/typography";

export function QuizCard() {
  const { t } = useTranslation("games");
  const router = useRouter();

  return (
    <RipplePressable
      onPress={() => router.push("/(app)/quiz")}
      style={styles.card}
      accessibilityRole="button"
    >
      <View style={styles.icon}>
        <MaterialCommunityIcons
          name="head-question-outline"
          size={22}
          color={theme.primary.clay}
        />
      </View>

      <View style={styles.texts}>
        <Text style={styles.title}>{t("quizTitle")}</Text>
        <Text style={styles.about}>{t("quizCardHint")}</Text>
      </View>

      <Feather name="chevron-right" size={18} color={theme.text.secondary} />
    </RipplePressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.s4,
    padding: theme.spacing.s4,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.functional.line,
    backgroundColor: theme.surface.card,
  },
  icon: {
    width: 46,
    height: 46,
    borderRadius: theme.radius.field,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.primary.claySoft,
  },
  texts: {
    flex: 1,
    gap: 3,
  },
  title: {
    fontSize: fontSize.s7,
    fontWeight: "700",
    color: theme.text.primary,
  },
  about: {
    ...type.bodySm,
  },
});
