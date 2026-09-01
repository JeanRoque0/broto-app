import { StyleSheet, View } from "react-native";

import { Text } from "@/components/ui/Text";
import { theme } from "@/style/theme";
import { fontSize } from "@/style/typography";

const LOW = 0.25;

type QuotaBarProps = {
  label: string;
  left: number;
  total: number;
};

export function QuotaBar({ label, left, total }: QuotaBarProps) {
  const ratio = total > 0 ? Math.max(0, Math.min(1, left / total)) : 0;

  const tone =
    ratio === 0
      ? theme.functional.danger
      : ratio <= LOW
        ? theme.secondary.ochre
        : theme.secondary.moss;

  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>

      <View style={styles.track}>
        <View
          style={[
            styles.fill,
            { width: `${ratio * 100}%`, backgroundColor: tone },
          ]}
        />
      </View>

      <Text family="mono" style={styles.value}>
        {Math.round(ratio * 100)}%
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.s3,
  },
  label: {
    fontSize: fontSize.s4,
    fontWeight: "700",
    color: theme.text.primary,
    width: 78,
  },
  track: {
    flex: 1,
    height: 8,
    borderRadius: 999,
    overflow: "hidden",
    backgroundColor: theme.functional.line,
  },
  fill: {
    height: "100%",
    borderRadius: 999,
  },
  value: {
    fontSize: fontSize.s3,
    color: theme.text.secondary,
    width: 44,
    textAlign: "right",
  },
});
