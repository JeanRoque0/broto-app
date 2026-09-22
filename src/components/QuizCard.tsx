import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { BrotinhoArt } from "@/components/illustrations/BrotinhoArt";
import { RipplePressable } from "@/components/ui/RipplePressable";
import { Text } from "@/components/ui/Text";
import { QUIZ_ROUND } from "@/constants/quiz";
import { useBestScore } from "@/hooks/useBestScore";
import { theme } from "@/style/theme";
import { fontSize } from "@/style/typography";

export function QuizCard() {
  const { t } = useTranslation("games");
  const router = useRouter();
  const { best } = useBestScore("quiz");

  const detail =
    best > 0
      ? t("quizCardBest", { best, total: QUIZ_ROUND })
      : t("quizCardHint");

  return (
    <RipplePressable
      onPress={() => router.push("/(app)/quiz")}
      pressScale={0.98}
      style={styles.card}
      accessibilityRole="button"
      accessibilityLabel={`${t("quizTitle")}. ${detail}`}
      accessibilityHint={t("play")}
    >
      <LinearGradient
        colors={[theme.secondary.moss, theme.secondary.mossDeep]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.art} pointerEvents="none">
        <BrotinhoArt size={112} />
      </View>

      <View style={styles.texts}>
        <Text style={styles.eyebrow}>{t("quizCardEyebrow")}</Text>
        <Text family="display" style={styles.title}>
          {t("quizTitle")}
        </Text>
        <Text style={styles.detail}>{detail}</Text>

        <View style={styles.play}>
          <Text style={styles.playLabel}>{t("play")}</Text>
          <Feather name="arrow-right" size={15} color={theme.secondary.moss} />
        </View>
      </View>
    </RipplePressable>
  );
}

const styles = StyleSheet.create({
  card: {
    overflow: "hidden",
    minHeight: 150,
    padding: theme.spacing.s5,
    borderRadius: theme.radius.lg,
  },
  art: {
    position: "absolute",
    right: -14,
    bottom: -18,
    opacity: 0.95,
  },
  texts: {
    width: "64%",
    gap: 4,
  },
  eyebrow: {
    fontSize: fontSize.s2,
    fontWeight: "700",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    color: theme.functional.white72,
  },
  title: {
    fontSize: fontSize.s11,
    fontWeight: "600",
    color: theme.text.onDark,
  },
  detail: {
    fontSize: fontSize.s5,
    lineHeight: 18,
    color: theme.functional.white72,
  },
  play: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 6,
    marginTop: theme.spacing.s3,
    paddingVertical: theme.spacing.s2,
    paddingHorizontal: theme.spacing.s4,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.surface.card,
  },
  playLabel: {
    fontSize: fontSize.s5,
    fontWeight: "700",
    color: theme.secondary.moss,
  },
});
