import { useEffect, useRef } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

import { RipplePressable } from "@/components/ui/RipplePressable";
import { Text } from "@/components/ui/Text";
import { theme } from "@/style/theme";
import { fontSize } from "@/style/typography";

export type Section = {
  id: string;
  label: string;
};

type SectionTabsProps = {
  sections: Section[];
  active: string;
  onSelect: (id: string) => void;
};

export function SectionTabs({ sections, active, onSelect }: SectionTabsProps) {
  const strip = useRef<ScrollView>(null);
  const positions = useRef<Record<string, { x: number; width: number }>>({});
  const viewport = useRef(0);

  useEffect(() => {
    const spot = positions.current[active];
    if (!spot || !viewport.current) return;

    strip.current?.scrollTo({
      x: Math.max(0, spot.x - (viewport.current - spot.width) / 2),
      animated: true,
    });
  }, [active]);

  return (
    <View style={styles.wrap}>
      <ScrollView
        ref={strip}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
        onLayout={(event) => {
          viewport.current = event.nativeEvent.layout.width;
        }}
      >
        {sections.map((section) => (
          <RipplePressable
            key={section.id}
            onPress={() => onSelect(section.id)}
            style={[styles.chip, section.id === active && styles.chipOn]}
            accessibilityRole="button"
            accessibilityState={{ selected: section.id === active }}
            onLayout={(event) => {
              const { x, width } = event.nativeEvent.layout;
              positions.current[section.id] = { x, width };
            }}
          >
            <Text
              style={[styles.label, section.id === active && styles.labelOn]}
              numberOfLines={1}
            >
              {section.label}
            </Text>
          </RipplePressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderTopWidth: 1,
    borderTopColor: theme.functional.line,
  },
  row: {
    gap: theme.spacing.s2,
    paddingHorizontal: theme.screenPadding,
    paddingVertical: theme.spacing.s3,
  },
  chip: {
    paddingVertical: theme.spacing.s2,
    paddingHorizontal: theme.spacing.s4,
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    borderColor: theme.functional.line,
    backgroundColor: theme.surface.card,
  },
  chipOn: {
    borderColor: theme.primary.clay,
    backgroundColor: theme.primary.claySoft,
  },
  label: {
    fontSize: fontSize.s5,
    fontWeight: "500",
    color: theme.text.secondary,
  },
  labelOn: {
    fontWeight: "700",
    color: theme.primary.clay,
  },
});
