import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { PlantPhoto } from "@/components/PlantPhoto";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import {
  ContainerModal,
  ModalScrollView,
} from "@/components/ui/ContainerModal";
import { RipplePressable } from "@/components/ui/RipplePressable";
import { Text } from "@/components/ui/Text";
import { theme } from "@/style/theme";
import { fontSize, type } from "@/style/typography";
import { Plant } from "@/types/plant";

type GroupPlantsSheetProps = {
  visible: boolean;
  onCreateNew: () => void;
  groupName: string;
  plants: Plant[];
  selectedIds: string[];
  saving: boolean;
  onClose: () => void;
  onSubmit: (plantIds: string[]) => void;
};

export function GroupPlantsSheet({
  visible,
  onCreateNew,
  groupName,
  plants,
  selectedIds,
  saving,
  onClose,
  onSubmit,
}: GroupPlantsSheetProps) {
  const { t } = useTranslation("plants");
  const [selected, setSelected] = useState<string[]>(selectedIds);

  useEffect(() => {
    if (visible) setSelected(selectedIds);
  }, [visible, selectedIds]);

  function toggle(plantId: string) {
    setSelected((current) =>
      current.includes(plantId)
        ? current.filter((id) => id !== plantId)
        : [...current, plantId],
    );
  }

  return (
    <ContainerModal
      visible={visible}
      onClose={onClose}
      title={t("groupPickTitle")}
      description={t("groupPickSubtitle", { group: groupName })}
    >
      {plants.length === 0 ? (
        <Text style={styles.empty}>{t("groupPickEmpty")}</Text>
      ) : (
        <ModalScrollView
          style={styles.list}
          showsVerticalScrollIndicator={false}
        >
          {plants.map((item) => {
            const checked = selected.includes(item.id);

            return (
              <RipplePressable
                key={item.id}
                onPress={() => toggle(item.id)}
                style={styles.row}
                accessibilityRole="checkbox"
                accessibilityState={{ checked }}
                accessibilityLabel={item.nickname}
              >
                <PlantPhoto
                  path={item.photo_path}
                  style={styles.thumb}
                  fallback={
                    <MaterialCommunityIcons
                      name="sprout-outline"
                      size={20}
                      color={theme.illustration.leaf}
                    />
                  }
                />

                <View style={styles.texts}>
                  <Text style={styles.name} numberOfLines={1}>
                    {item.nickname}
                  </Text>
                  {item.species_common && (
                    <Text style={styles.species} numberOfLines={1}>
                      {item.species_common}
                    </Text>
                  )}
                </View>

                <View
                  accessibilityElementsHidden
                  importantForAccessibility="no-hide-descendants"
                >
                  <Checkbox value={checked} onChange={() => toggle(item.id)} />
                </View>
              </RipplePressable>
            );
          })}
        </ModalScrollView>
      )}

      <RipplePressable
        onPress={onCreateNew}
        style={styles.createRow}
        accessibilityRole="button"
      >
        <View style={styles.createIcon}>
          <Feather name="plus" size={18} color={theme.primary.clay} />
        </View>
        <Text style={styles.createLabel}>{t("groupCreatePlant")}</Text>
      </RipplePressable>

      <Button
        label={
          selected.length === 0
            ? t("groupPickConfirmNone")
            : t("groupPickConfirm", { count: selected.length })
        }
        onPress={() => onSubmit(selected)}
        loading={saving}
        style={styles.action}
      />
    </ContainerModal>
  );
}

const styles = StyleSheet.create({
  list: {
    marginTop: theme.spacing.s4,
    marginHorizontal: -theme.spacing.s2,
  },
  empty: {
    ...type.bodySm,
    marginTop: theme.spacing.s5,
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.s3,
    paddingVertical: theme.spacing.s2,
    paddingHorizontal: theme.spacing.s2,
    borderRadius: theme.radius.md,
    backgroundColor: theme.surface.base,
  },
  createRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.s3,
    marginTop: theme.spacing.s3,
    paddingVertical: theme.spacing.s2,
    paddingHorizontal: theme.spacing.s2,
    marginHorizontal: -theme.spacing.s2,
    borderRadius: theme.radius.md,
    backgroundColor: theme.surface.base,
  },
  createIcon: {
    width: 44,
    height: 44,
    borderRadius: theme.radius.field,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.primary.claySoft,
  },
  createLabel: {
    flex: 1,
    fontSize: fontSize.s6,
    fontWeight: "500",
    color: theme.primary.clay,
  },
  thumb: {
    width: 44,
    height: 44,
    borderRadius: theme.radius.field,
  },
  texts: {
    flex: 1,
    gap: 1,
  },
  name: {
    fontSize: fontSize.s6,
    color: theme.text.primary,
  },
  species: {
    ...type.bodySm,
    fontStyle: "italic",
  },
  action: {
    marginTop: theme.spacing.s4,
  },
});
