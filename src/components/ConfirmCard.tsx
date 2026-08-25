import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";

import { Card } from "@/components/ui/Card";
import { Text } from "@/components/ui/Text";
import { theme } from "@/style/theme";
import { fontSize, type } from "@/style/typography";
import { AnalysisResult, ConfirmStep } from "@/types/identification";

type ConfirmCardProps = {
  value: AnalysisResult["como_confirmar"];
  style?: StyleProp<ViewStyle>;
};

function toSteps(value: AnalysisResult["como_confirmar"]): ConfirmStep[] {
  if (!value) return [];
  if (typeof value === "string") {
    const text = value.trim();
    return text ? [{ causa: "", teste: text }] : [];
  }

  return value.filter((step) => step?.teste?.trim());
}

export function ConfirmCard({ value, style }: ConfirmCardProps) {
  const steps = toSteps(value);

  if (steps.length === 0) return null;

  return (
    <Card style={[styles.card, style]}>
      {steps.map((step, index) => (
        <View
          key={step.causa || index}
          style={index > 0 ? styles.spaced : undefined}
        >
          {!!step.causa && <Text style={styles.cause}>{step.causa}</Text>}
          <Text style={styles.text}>{step.teste}</Text>
        </View>
      ))}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.primary.claySoft,
    borderColor: theme.primary.clayBorder,
  },
  spaced: {
    marginTop: theme.spacing.s4,
    borderTopWidth: 1,
    borderTopColor: theme.primary.clayBorder,
    paddingTop: theme.spacing.s4,
  },
  cause: {
    ...type.sectionTitle,
    fontSize: fontSize.s7,
    marginBottom: 3,
  },
  text: {
    fontSize: fontSize.s6,
    lineHeight: 22,
    color: theme.text.primary,
  },
});
