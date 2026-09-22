import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";

import { RipplePressable } from "@/components/ui/RipplePressable";
import { theme } from "@/style/theme";
import { fontSize, type } from "@/style/typography";

import { Text } from "./Text";

type ChoiceCardProps = {
  icon: React.ComponentProps<typeof Feather>["name"];
  title: string;
  description?: string;
  badge?: string;
  highlighted?: boolean;
  tone?: "default" | "danger";
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
};

export function ChoiceCard({
  icon,
  title,
  description,
  badge,
  highlighted = false,
  tone = "default",
  onPress,
  style,
}: ChoiceCardProps) {
  const danger = tone === "danger";

  return (
    <RipplePressable
      onPress={onPress}
      pressScale={0.98}
      style={[styles.card, highlighted && styles.highlighted, style]}
      accessibilityRole="button"
      accessibilityLabel={[title, badge, description]
        .filter(Boolean)
        .join(". ")}
    >
      <View
        style={[
          styles.icon,
          highlighted && styles.iconHighlighted,
          danger && styles.iconDanger,
        ]}
      >
        <Feather
          name={icon}
          size={20}
          color={
            highlighted
              ? theme.text.onPrimary
              : danger
                ? theme.functional.danger
                : theme.primary.clay
          }
        />
      </View>

      <View style={styles.texts}>
        <View style={styles.titleRow}>
          <Text style={[styles.title, danger && styles.titleDanger]}>
            {title}
          </Text>
          {badge && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{badge}</Text>
            </View>
          )}
        </View>
        {description && <Text style={styles.description}>{description}</Text>}
      </View>

      <Feather name="chevron-right" size={18} color={theme.text.tertiary} />
    </RipplePressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.s3,
    padding: theme.spacing.s4,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.functional.line,
    backgroundColor: theme.surface.card,
  },
  highlighted: {
    borderColor: theme.primary.clayBorder,
    backgroundColor: theme.primary.clayTint,
  },
  icon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.primary.claySoft,
  },
  iconHighlighted: {
    backgroundColor: theme.primary.clay,
  },
  iconDanger: {
    backgroundColor: theme.functional.dangerSoft,
  },
  texts: {
    flex: 1,
    gap: 2,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: theme.spacing.s2,
  },
  title: {
    fontSize: fontSize.s7,
    fontWeight: "700",
    color: theme.text.primary,
  },
  titleDanger: {
    color: theme.functional.danger,
  },
  badge: {
    paddingHorizontal: theme.spacing.s2,
    paddingVertical: 1,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.secondary.mossSoft,
  },
  badgeText: {
    fontSize: fontSize.s2,
    fontWeight: "700",
    color: theme.secondary.moss,
  },
  description: {
    ...type.bodySm,
  },
});
