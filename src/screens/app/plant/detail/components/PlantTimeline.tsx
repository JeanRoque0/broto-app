import { ScrollView, StyleSheet, View } from "react-native";

import { PlantPhoto } from "@/components/PlantPhoto";
import { RipplePressable } from "@/components/ui/RipplePressable";
import { Text } from "@/components/ui/Text";
import { theme } from "@/style/theme";
import { fontSize } from "@/style/typography";
import { Identification } from "@/types/identification";
import { formatShortDate } from "@/utils/format";

const THUMB = 92;

type PlantTimelineProps = {
  items: Identification[];
  onOpen: (item: Identification) => void;
};

export function PlantTimeline({ items, onOpen }: PlantTimelineProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.strip}
    >
      {items.map((item) => {
        const sick = item.result?.saude !== "saudavel";

        return (
          <RipplePressable
            key={item.id}
            onPress={() => onOpen(item)}
            style={styles.item}
            accessibilityRole="button"
            accessibilityLabel={formatShortDate(new Date(item.created_at))}
          >
            <PlantPhoto path={item.photo_path} style={styles.photo} />

            <View style={styles.legend}>
              <View style={[styles.dot, sick && styles.dotSick]} />
              <Text family="mono" style={styles.date}>
                {formatShortDate(new Date(item.created_at))}
              </Text>
            </View>
          </RipplePressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  strip: {
    gap: theme.spacing.s3,
    paddingHorizontal: theme.screenPadding,
    paddingVertical: theme.spacing.s2,
  },
  item: {
    width: THUMB,
    gap: theme.spacing.s2,
    borderRadius: theme.radius.md,
  },
  photo: {
    width: THUMB,
    height: THUMB,
    borderRadius: theme.radius.md,
  },
  legend: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.secondary.moss,
  },
  dotSick: {
    backgroundColor: theme.secondary.ochre,
  },
  date: {
    fontSize: fontSize.s2,
    color: theme.text.secondary,
  },
});
