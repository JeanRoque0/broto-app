import { Feather } from "@expo/vector-icons";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { GroupCard } from "@/components/GroupCard";
import { PlantCard } from "@/components/PlantCard";
import { AppRefreshControl } from "@/components/ui/AppRefreshControl";
import { FlashListContainer } from "@/components/ui/FlashListContainer";
import { RipplePressable } from "@/components/ui/RipplePressable";
import { Text } from "@/components/ui/Text";
import { theme } from "@/style/theme";
import { fontSize, type } from "@/style/typography";
import type { Plant, PlantGroup } from "@/types/plant";

type Row =
  | { key: string; kind: "groupsHead" }
  | { key: string; kind: "group"; group: PlantGroup }
  | { key: string; kind: "plantsHead" }
  | { key: string; kind: "plant"; plant: Plant };

type PlantsPanelProps = {
  bottomSpace: number;
  plants: Plant[];
  groups: PlantGroup[];
  plantsByGroup: Map<string, Plant[]>;
  refreshing: boolean;
  onRefresh: () => void;
  onOpenPlant: (plantId: string) => void;
  onOpenGroup: (groupId: string) => void;
  onAddToGroup: (group: PlantGroup) => void;
  onNewGroup: () => void;
};

export function PlantsPanel({
  bottomSpace,
  plants,
  groups,
  plantsByGroup,
  refreshing,
  onRefresh,
  onOpenPlant,
  onOpenGroup,
  onAddToGroup,
  onNewGroup,
}: PlantsPanelProps) {
  const { t } = useTranslation("plants");

  const rows = useMemo<Row[]>(
    () => [
      ...(groups.length > 0
        ? [{ key: "groupsHead", kind: "groupsHead" } as Row]
        : []),
      ...groups.map<Row>((group) => ({
        key: `group:${group.id}`,
        kind: "group",
        group,
      })),
      { key: "plantsHead", kind: "plantsHead" },
      ...plants.map<Row>((plant) => ({
        key: `plant:${plant.id}`,
        kind: "plant",
        plant,
      })),
    ],
    [groups, plants],
  );

  return (
    <FlashListContainer
      data={rows}
      extraData={plantsByGroup}
      keyExtractor={(row) => row.key}
      getItemType={(row) => row.kind}
      contentContainerStyle={{
        paddingTop: theme.spacing.s3,
        paddingBottom: bottomSpace,
      }}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <AppRefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      renderItem={({ item, index }) => {
        const head = [
          styles.padded,
          styles.sectionHead,
          index === 0 && styles.sectionHeadFirst,
        ];

        if (item.kind === "groupsHead") {
          return (
            <View style={head}>
              <Text family="display" style={styles.sectionTitle}>
                {t("groupsTitle")}
              </Text>

              <RipplePressable
                onPress={onNewGroup}
                style={styles.newGroup}
                accessibilityRole="button"
              >
                <Feather name="plus" size={13} color={theme.primary.clay} />
                <Text style={styles.newGroupLabel}>{t("newGroup")}</Text>
              </RipplePressable>
            </View>
          );
        }

        if (item.kind === "plantsHead") {
          return (
            <View style={head}>
              <Text family="display" style={styles.sectionTitle}>
                {t("allPlants")}
              </Text>

              {groups.length === 0 && (
                <RipplePressable
                  onPress={onNewGroup}
                  style={styles.newGroup}
                  accessibilityRole="button"
                >
                  <Feather name="plus" size={13} color={theme.primary.clay} />
                  <Text style={styles.newGroupLabel}>{t("newGroup")}</Text>
                </RipplePressable>
              )}
            </View>
          );
        }

        if (item.kind === "group") {
          return (
            <View style={styles.padded}>
              <GroupCard
                group={item.group}
                plants={plantsByGroup.get(item.group.id) ?? []}
                onPress={() => onOpenGroup(item.group.id)}
                onAddPlant={() => onAddToGroup(item.group)}
              />
            </View>
          );
        }

        return (
          <View style={styles.padded}>
            <PlantCard
              plant={item.plant}
              onPress={() => onOpenPlant(item.plant.id)}
            />
          </View>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  padded: {
    paddingHorizontal: theme.screenPadding,
  },
  sectionTitle: {
    ...type.displayXs,
  },
  sectionHead: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: theme.spacing.s6,
    marginBottom: theme.spacing.s3,
  },
  sectionHeadFirst: {
    marginTop: 0,
  },
  newGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.primary.claySoft,
  },
  newGroupLabel: {
    fontSize: fontSize.s3,
    fontWeight: "500",
    color: theme.primary.clay,
  },
});
