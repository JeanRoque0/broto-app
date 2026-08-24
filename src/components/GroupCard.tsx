import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { PlantPhoto } from "@/components/PlantPhoto";
import { RipplePressable } from "@/components/ui/RipplePressable";
import { Text } from "@/components/ui/Text";
import { theme } from "@/style/theme";
import { fontSize, type } from "@/style/typography";
import { Plant, PlantGroup } from "@/types/plant";

const MAX_COVERS = 3;
const COVER_SIZE = 46;
const OFFSET = 7;

type GroupCardProps = {
  group: PlantGroup;
  plants: Plant[];
  onPress: () => void;
  onAddPlant: () => void;
};

export function GroupCard({
  group,
  plants,
  onPress,
  onAddPlant,
}: GroupCardProps) {
  const { t } = useTranslation("plants");
  const covers = plants.slice(0, MAX_COVERS);

  return (
    <RipplePressable
      onPress={onPress}
      style={styles.card}
      accessibilityRole="button"
      accessibilityLabel={group.name}
    >
      <View style={styles.stack}>
        {covers.length === 0 ? (
          <View style={[styles.cover, styles.coverEmpty]}>
            <MaterialCommunityIcons
              name="leaf"
              size={22}
              color={theme.illustration.leaf}
            />
          </View>
        ) : (
          [...covers].reverse().map((plant, index) => {
            const depth = covers.length - 1 - index;

            return (
              <PlantPhoto
                key={plant.id}
                path={plant.photo_path}
                style={[
                  styles.cover,
                  { left: depth * OFFSET, top: depth * OFFSET },
                  depth > 0 && styles.coverBack,
                ]}
                fallback={
                  <MaterialCommunityIcons
                    name="sprout-outline"
                    size={18}
                    color={theme.illustration.leaf}
                  />
                }
              />
            );
          })
        )}
      </View>

      <View style={styles.texts}>
        <Text style={styles.name} numberOfLines={2}>
          {group.name}
        </Text>
        <Text family="mono" style={styles.count}>
          {t("groupPlantCount", { count: plants.length })}
        </Text>

        <RipplePressable
          onPress={onAddPlant}
          style={styles.add}
          accessibilityRole="button"
        >
          <Feather name="plus" size={13} color={theme.primary.clay} />
          <Text style={styles.addLabel}>{t("groupAddPlant")}</Text>
        </RipplePressable>
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
  stack: {
    width: COVER_SIZE + OFFSET * (MAX_COVERS - 1),
    height: COVER_SIZE + OFFSET * (MAX_COVERS - 1),
  },
  cover: {
    position: "absolute",
    width: COVER_SIZE,
    height: COVER_SIZE,
    borderRadius: theme.radius.field,
  },
  coverBack: {
    borderWidth: 1,
    borderColor: theme.functional.line,
    backgroundColor: theme.surface.container,
    opacity: 0.55,
  },
  coverEmpty: {
    left: 0,
    top: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.surface.container,
    borderWidth: 1,
    borderColor: theme.functional.line,
  },
  texts: {
    flex: 1,
    gap: 2,
    alignItems: "flex-start",
  },
  name: {
    fontSize: fontSize.s6,
    fontWeight: "700",
    color: theme.text.primary,
  },
  count: {
    ...type.bodySm,
    fontSize: fontSize.s3,
  },
  add: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: theme.spacing.s2,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.primary.claySoft,
  },
  addLabel: {
    fontSize: fontSize.s3,
    fontWeight: "500",
    color: theme.primary.clay,
  },
});
