import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { Card } from "@/components/ui/Card";
import { Text } from "@/components/ui/Text";
import { theme } from "@/style/theme";
import { fontSize, type } from "@/style/typography";
import { useUnitsStore } from "@/store";
import { Care, Temperature } from "@/types/identification";
import { convertRange } from "@/utils/temperature";

type Line = {
  icon: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  label: string;
  value: string;
  note: string;
};

export function CareTiles({
  cuidados,
  temperatura,
}: {
  cuidados: Care;
  temperatura?: Temperature | null;
}) {
  const { t } = useTranslation("analysis");
  const unit = useUnitsStore((state) => state.temperature);

  const lines: Line[] = [
    {
      icon: "water-outline",
      label: t("wateringLabel"),
      value: t("watering", { count: cuidados.rega_dias }),
      note: "",
    },
    {
      icon: "white-balance-sunny",
      label: t("lightLabel"),
      value: t(`luz_${cuidados.luz}`),
      note: cuidados.luz_nota,
    },
    {
      icon: "sprout-outline",
      label: t("fertilizerLabel"),
      value: t(`adubo_${cuidados.adubo}`),
      note: cuidados.adubo_nota,
    },
  ];

  if (temperatura) {
    const range = convertRange(temperatura, unit);

    lines.push({
      icon: "thermometer",
      label: t("temperatureLabel"),
      value: t("temperatureRange", range),
      note: temperatura.nota,
    });
  }

  return (
    <Card style={styles.card}>
      {lines.map((line, index) => (
        <View
          key={line.label}
          style={[styles.row, index === lines.length - 1 && styles.rowLast]}
        >
          <View style={styles.icon}>
            <MaterialCommunityIcons
              name={line.icon}
              size={18}
              color={theme.primary.clay}
            />
          </View>

          <View style={styles.texts}>
            <Text family="mono" style={styles.label}>
              {line.label}
            </Text>
            <Text style={styles.value}>{line.value}</Text>
            {!!line.note && <Text style={styles.note}>{line.note}</Text>}
          </View>
        </View>
      ))}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: theme.spacing.s3,
    paddingVertical: theme.spacing.s2,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: theme.spacing.s4,
    paddingVertical: theme.spacing.s4,
    borderBottomWidth: 1,
    borderBottomColor: theme.functional.line,
  },
  rowLast: {
    borderBottomWidth: 0,
  },
  icon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.primary.clayTint,
    borderWidth: 1,
    borderColor: theme.primary.clayBorder,
  },
  texts: {
    flex: 1,
    gap: 2,
    paddingTop: 2,
  },
  label: {
    fontSize: fontSize.s1,
    letterSpacing: 1.1,
    textTransform: "uppercase",
    color: theme.text.tertiary,
  },
  value: {
    ...type.sectionTitle,
    fontSize: fontSize.s7,
  },
  note: {
    ...type.bodySm,
    marginTop: 1,
  },
});
