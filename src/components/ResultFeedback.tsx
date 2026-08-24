import { Feather } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { RipplePressable } from "@/components/ui/RipplePressable";
import { Text } from "@/components/ui/Text";
import { theme } from "@/style/theme";
import { fontSize } from "@/style/typography";

type ResultFeedbackProps = {
  answer: boolean | null;
  onAnswer: (helpful: boolean) => void;
};

export function ResultFeedback({ answer, onAnswer }: ResultFeedbackProps) {
  const { t } = useTranslation("analysis");
  const answered = answer !== null;

  return (
    <View style={styles.card}>
      <Text style={styles.question}>
        {answered ? t("feedbackThanks") : t("feedbackQuestion")}
      </Text>

      <View style={styles.buttons}>
        <RipplePressable
          onPress={() => onAnswer(true)}
          borderless
          radius={20}
          style={[styles.button, answer === true && styles.buttonOn]}
          accessibilityRole="button"
          accessibilityLabel={t("feedbackYes")}
        >
          <Feather
            name="thumbs-up"
            size={17}
            color={
              answer === true ? theme.text.onPrimary : theme.text.secondary
            }
          />
        </RipplePressable>

        <RipplePressable
          onPress={() => onAnswer(false)}
          borderless
          radius={20}
          style={[styles.button, answer === false && styles.buttonOff]}
          accessibilityRole="button"
          accessibilityLabel={t("feedbackNo")}
        >
          <Feather
            name="thumbs-down"
            size={17}
            color={
              answer === false ? theme.text.onPrimary : theme.text.secondary
            }
          />
        </RipplePressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.s3,
    marginTop: theme.spacing.s4,
    paddingVertical: theme.spacing.s3,
    paddingHorizontal: theme.spacing.s4,
    backgroundColor: theme.surface.card,
    borderWidth: 1,
    borderColor: theme.functional.line,
    borderRadius: theme.radius.md,
  },
  question: {
    flex: 1,
    fontSize: fontSize.s6,
    color: theme.text.primary,
  },
  buttons: {
    flexDirection: "row",
    gap: theme.spacing.s2,
  },
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.surface.container,
  },
  buttonOn: {
    backgroundColor: theme.secondary.moss,
  },
  buttonOff: {
    backgroundColor: theme.functional.danger,
  },
});
