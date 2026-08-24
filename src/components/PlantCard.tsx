import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { PlantPhoto } from "@/components/PlantPhoto";
import { RipplePressable } from "@/components/ui/RipplePressable";
import { StatusDot } from "@/components/ui/StatusDot";
import { Text } from "@/components/ui/Text";
import { theme } from "@/style/theme";
import { fontSize } from "@/style/typography";
import { Plant } from "@/types/plant";
import { getWateringInfo } from "@/utils/watering";

type PlantCardProps = {
  plant: Plant;
  onPress: () => void;
};

export function PlantCard({ plant, onPress }: PlantCardProps) {
  const { t } = useTranslation("watering");
  const watering = getWateringInfo(plant);

  return (
    <RipplePressable onPress={onPress} style={styles.card}>
      <PlantPhoto
        path={plant.photo_path}
        style={styles.thumb}
        fallback={
          <MaterialCommunityIcons
            name="sprout-outline"
            size={24}
            color={theme.illustration.leaf}
          />
        }
      />

      <View style={styles.texts}>
        <Text style={styles.name} numberOfLines={2}>
          {plant.nickname}
        </Text>
        <View style={styles.meta}>
          <StatusDot status={watering.status} />
          <Text style={styles.metaLabel}>
            {t(watering.labelKey, watering.labelParams)}
          </Text>
        </View>
      </View>

      <Feather name="chevron-right" size={18} color={theme.text.secondary} />
    </RipplePressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.s4,
    padding: theme.spacing.s3,
    marginBottom: theme.spacing.s2,
    backgroundColor: theme.surface.card,
    borderWidth: 1,
    borderColor: theme.functional.line,
    borderRadius: theme.radius.md,
  },
  thumb: {
    width: 56,
    height: 56,
    borderRadius: theme.radius.field,
  },
  texts: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontSize: fontSize.s6,
    fontWeight: "700",
    color: theme.text.primary,
  },
  meta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  metaLabel: {
    fontSize: fontSize.s3,
    color: theme.text.secondary,
  },
});
