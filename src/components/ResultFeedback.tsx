import { Feather } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { RipplePressable } from "@/components/ui/RipplePressable";
import { Text } from "@/components/ui/Text";
import { theme } from "@/style/theme";
import { fontSize, type } from "@/style/typography";

type ResultFeedbackProps = {
  answer: boolean | null;
  onAnswer: (helpful: boolean) => void;
  onReport?: () => void;
};

export function ResultFeedback({
  answer,
  onAnswer,
  onReport,
}: ResultFeedbackProps) {
  const { t } = useTranslation("analysis");

  if (answer !== null) {
    return (
      <View
        style={[styles.card, answer ? styles.cardYes : styles.cardNo]}
        accessibilityLiveRegion="polite"
      >
        <View style={[styles.badge, answer ? styles.badgeYes : styles.badgeNo]}>
          <Feather
            name={answer ? "check" : "message-circle"}
            size={18}
            color={theme.text.onPrimary}
          />
        </View>
        <View style={styles.texts}>
          <Text style={styles.title}>{t("feedbackThanks")}</Text>
          <Text style={styles.hint}>
            {answer ? t("feedbackThanksYes") : t("feedbackThanksNo")}
          </Text>
          {!answer && onReport && (
            <RipplePressable
              onPress={onReport}
              style={styles.report}
              accessibilityRole="button"
            >
              <Text style={styles.reportLabel}>{t("feedbackReport")}</Text>
              <Feather
                name="chevron-right"
                size={15}
                color={theme.primary.clay}
              />
            </RipplePressable>
          )}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{t("feedbackQuestion")}</Text>
      <Text style={styles.hint}>{t("feedbackHint")}</Text>

      <View style={styles.buttons}>
        <RipplePressable
          onPress={() => onAnswer(true)}
          pressScale={0.97}
          style={[styles.button, styles.buttonYes]}
          accessibilityRole="button"
          accessibilityLabel={t("feedbackYes")}
        >
          <Feather name="thumbs-up" size={17} color={theme.secondary.moss} />
          <Text style={[styles.buttonLabel, styles.buttonLabelYes]}>
            {t("feedbackYes")}
          </Text>
        </RipplePressable>

        <RipplePressable
          onPress={() => onAnswer(false)}
          pressScale={0.97}
          style={[styles.button, styles.buttonNo]}
          accessibilityRole="button"
          accessibilityLabel={t("feedbackNo")}
        >
          <Feather name="thumbs-down" size={17} color={theme.primary.clay} />
          <Text style={[styles.buttonLabel, styles.buttonLabelNo]}>
            {t("feedbackNo")}
          </Text>
        </RipplePressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: theme.spacing.s1,
    padding: theme.spacing.s5,
    backgroundColor: theme.surface.card,
    borderWidth: 1,
    borderColor: theme.functional.line,
    borderRadius: theme.radius.lg,
  },
  cardYes: {
    flexDirection: "row",
    gap: theme.spacing.s3,
    backgroundColor: theme.secondary.mossSoft,
    borderColor: theme.secondary.mossSoft,
  },
  cardNo: {
    flexDirection: "row",
    gap: theme.spacing.s3,
    backgroundColor: theme.primary.clayTint,
    borderColor: theme.primary.clayBorder,
  },
  badge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeYes: {
    backgroundColor: theme.secondary.moss,
  },
  badgeNo: {
    backgroundColor: theme.primary.clay,
  },
  texts: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: fontSize.s8,
    fontWeight: "700",
    color: theme.text.primary,
  },
  hint: {
    ...type.bodySm,
  },
  buttons: {
    flexDirection: "row",
    gap: theme.spacing.s2,
    marginTop: theme.spacing.s3,
  },
  button: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.s2,
    minHeight: 48,
    borderRadius: theme.radius.button,
  },
  buttonYes: {
    backgroundColor: theme.secondary.mossSoft,
  },
  buttonNo: {
    backgroundColor: theme.primary.claySoft,
  },
  buttonLabel: {
    fontSize: fontSize.s6,
    fontWeight: "700",
  },
  buttonLabelYes: {
    color: theme.secondary.moss,
  },
  buttonLabelNo: {
    color: theme.primary.clay,
  },
  report: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 2,
    marginTop: theme.spacing.s2,
  },
  reportLabel: {
    fontSize: fontSize.s5,
    fontWeight: "700",
    color: theme.primary.clay,
  },
});
