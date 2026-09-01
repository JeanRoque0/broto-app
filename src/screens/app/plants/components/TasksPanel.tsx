import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { FlashListContainer } from "@/components/ui/FlashListContainer";
import { RipplePressable } from "@/components/ui/RipplePressable";
import { Text } from "@/components/ui/Text";
import { formatLongDate } from "@/utils/format";
import { theme } from "@/style/theme";
import { fontSize, type } from "@/style/typography";

import { DayStrip } from "./DayStrip";
import { TaskEditSheet } from "@/components/TaskEditSheet";

import { TaskRow } from "./TaskRow";
import { useTasks } from "./useTasks";

type TasksPanelProps = {
  bottomSpace: number;
};

export function TasksPanel({ bottomSpace }: TasksPanelProps) {
  const { t } = useTranslation("plants");
  const {
    days,
    initialIndex,
    selected,
    select,
    tasks,
    nextDay,
    hasPlants,
    isPro,
    pending,
    complete,
    editing,
    edit,
    closeEdit,
    savingTask,
    saveTask,
    toggleTask,
    openPaywall,
  } = useTasks();

  const listHeader = (
    <>
      <View style={styles.panel}>
        <DayStrip
          days={days}
          selected={selected}
          initialIndex={initialIndex}
          onSelect={select}
        />
      </View>

      {tasks.length === 0 && (
        <View style={styles.list}>
          {nextDay && (
            <RipplePressable
              onPress={() => select(nextDay)}
              style={styles.nextChip}
              accessibilityRole="button"
            >
              <Text style={styles.nextLabel}>
                {t("nextTaskChip", { date: formatLongDate(nextDay) })}
              </Text>
              <Feather
                name="chevron-right"
                size={15}
                color={theme.primary.clay}
              />
            </RipplePressable>
          )}

          <EmptyState
            title={t(hasPlants ? "tasksEmptyTitle" : "tasksNoPlantsTitle")}
            description={t(
              hasPlants ? "tasksEmptyDescription" : "tasksNoPlantsDescription",
            )}
          />
        </View>
      )}
    </>
  );

  return (
    <>
      <FlashListContainer
        data={tasks}
        keyExtractor={(task) => `${task.plant.id}:${task.kind}`}
        ListHeaderComponent={listHeader}
        ListHeaderComponentStyle={
          tasks.length > 0 ? styles.headSpace : undefined
        }
        ListFooterComponent={
          !isPro && hasPlants ? (
            <View style={styles.padded}>
              <Card style={styles.upsell}>
                <MaterialCommunityIcons
                  name="bag-personal-outline"
                  size={20}
                  color={theme.primary.clay}
                />
                <View style={styles.upsellTexts}>
                  <Text style={styles.upsellTitle}>{t("tasksProTitle")}</Text>
                  <Text style={styles.upsellText}>{t("tasksProText")}</Text>
                  <Button
                    label={t("tasksProAction")}
                    onPress={openPaywall}
                    variant="outline"
                    style={styles.upsellAction}
                  />
                </View>
              </Card>
            </View>
          ) : null
        }
        contentContainerStyle={{ paddingBottom: bottomSpace }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.padded}>
            <TaskRow
              task={item}
              loading={pending === `${item.plant.id}:${item.kind}`}
              onComplete={() => complete(item.plant.id, item.kind)}
              onEdit={() => edit(item)}
            />
          </View>
        )}
      />

      <TaskEditSheet
        task={editing?.task ?? null}
        plantName={editing?.plant.nickname ?? ""}
        saving={savingTask}
        onClose={closeEdit}
        onSave={saveTask}
        onToggle={toggleTask}
      />
    </>
  );
}

const styles = StyleSheet.create({
  panel: {
    marginTop: theme.spacing.s5,
  },
  list: {
    paddingHorizontal: theme.screenPadding,
    marginTop: theme.spacing.s5,
  },
  padded: {
    paddingHorizontal: theme.screenPadding,
  },
  headSpace: {
    marginBottom: theme.spacing.s5,
  },
  nextChip: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    gap: 4,
    paddingVertical: theme.spacing.s2,
    paddingHorizontal: theme.spacing.s4,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.primary.claySoft,
  },
  nextLabel: {
    fontSize: fontSize.s5,
    fontWeight: "500",
    color: theme.primary.clay,
  },
  upsell: {
    marginTop: theme.spacing.s4,
    flexDirection: "row",
    gap: theme.spacing.s3,
    alignItems: "flex-start",
    backgroundColor: theme.primary.clayTint,
    borderColor: theme.primary.clayBorder,
  },
  upsellTexts: {
    flex: 1,
    gap: 3,
  },
  upsellTitle: {
    ...type.sectionTitle,
  },
  upsellText: {
    ...type.bodySm,
  },
  upsellAction: {
    marginTop: theme.spacing.s3,
  },
});
