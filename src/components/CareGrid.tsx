import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";

import { Text } from "@/components/ui/Text";
import { theme } from "@/style/theme";
import { fontSize, type } from "@/style/typography";

export type CareTone = "moss" | "ochre" | "clay" | "neutral";

export type CareItem = {
  icon: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  label: string;
  value: string;
  note: string;
  tone: CareTone;
  wide?: boolean;
};

const TONES: Record<CareTone, { bg: string; fg: string; border: string }> = {
  moss: {
    bg: theme.secondary.mossSoft,
    fg: theme.secondary.moss,
    border: theme.secondary.mossSoft,
  },
  ochre: {
    bg: theme.secondary.ochreSoft,
    fg: theme.secondary.ochre,
    border: theme.secondary.ochreSoft,
  },
  clay: {
    bg: theme.primary.clayTint,
    fg: theme.primary.clay,
    border: theme.primary.clayBorder,
  },
  neutral: {
    bg: theme.surface.card,
    fg: theme.text.primary,
    border: theme.functional.line,
  },
};

export function CareGrid({ items }: { items: CareItem[] }) {
  return (
    <View style={styles.grid}>
      {items.map((item) => {
        const tone = TONES[item.tone];
        return (
          <View
            key={item.label}
            style={[
              styles.tile,
              item.wide && styles.tileWide,
              { backgroundColor: tone.bg, borderColor: tone.border },
            ]}
            accessible
            accessibilityLabel={[item.label, item.value, item.note]
              .filter(Boolean)
              .join(". ")}
          >
            <View style={styles.head}>
              <View style={styles.icon}>
                <MaterialCommunityIcons
                  name={item.icon}
                  size={17}
                  color={tone.fg}
                />
              </View>
              <Text style={[styles.label, { color: tone.fg }]}>
                {item.label}
              </Text>
            </View>
            <Text style={styles.value}>{item.value}</Text>
            {!!item.note && (
              <Text style={styles.note}>
                {item.note}
              </Text>
            )}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.s2,
    marginTop: theme.spacing.s3,
  },
  tile: {
    flexGrow: 1,
    flexBasis: "46%",
    gap: theme.spacing.s1,
    padding: theme.spacing.s4,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
  },
  tileWide: {
    flexBasis: "100%",
  },
  head: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.s2,
    marginBottom: theme.spacing.s1,
  },
  icon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.surface.card,
  },
  label: {
    fontSize: fontSize.s3,
    fontWeight: "700",
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },
  value: {
    fontSize: fontSize.s8,
    fontWeight: "700",
    color: theme.text.primary,
  },
  note: {
    ...type.bodySm,
  },
});
