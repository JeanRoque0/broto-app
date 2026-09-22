import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useMemo } from "react";
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

import { TourAnchor } from "@/components/tour/TourAnchor";
import { useScreenTour } from "@/components/tour/useScreenTour";

import { DayStrip } from "./DayStrip";
import { TaskEditSheet } from "@/components/TaskEditSheet";

import { TaskGroup } from "./TaskGroup";
import { useTasks } from "./useTasks";

const TASKS_TOUR = [
  { anchor: "tasks.days", copy: "tasksDays" },
  { anchor: "tasks.group", copy: "tasksGroup" },
] as const;

type TasksPanelProps = {
  active: boolean;
  topSpace: number;
  bottomSpace: number;
  onSwipeLock?: (locked: boolean) => void;
};

export function TasksPanel({
  active,
  topSpace,
  bottomSpace,
  onSwipeLock,
}: TasksPanelProps) {
  const { t } = useTranslation("plants");
  const {
    days,
    initialIndex,
    selected,
    select,
    tasks,
    nextDay,
    hasPlants,
    fullAccess,
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
  const router = useRouter();
  useScreenTour("tasks", TASKS_TOUR, active && tasks.length > 0);

  const groups = useMemo(() => {
    const byPlant = new Map<string, typeof tasks>();
    for (const task of tasks) {
      const list = byPlant.get(task.plant.id) ?? [];
      list.push(task);
      byPlant.set(task.plant.id, list);
    }
    return [...byPlant.values()];
  }, [tasks]);

  const listHeader = (
    <>
      <View>
        <TourAnchor id="tasks.days" />
        <DayStrip
          days={days}
          selected={selected}
          initialIndex={initialIndex}
          onSelect={select}
          onSwipeLock={onSwipeLock}
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
        data={groups}
        keyExtractor={(group) => group[0].plant.id}
        ListHeaderComponent={listHeader}
        ListHeaderComponentStyle={
          tasks.length > 0 ? styles.headSpace : undefined
        }
        ListFooterComponent={
          !fullAccess && hasPlants ? (
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
        contentContainerStyle={{
          paddingTop: topSpace + theme.spacing.s3,
          paddingBottom: bottomSpace,
        }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <View style={styles.padded}>
            <TaskGroup
              tourId={index === 0 ? "tasks.group" : undefined}
              tasks={item}
              pending={pending}
              onComplete={(task) => complete(task.plant.id, task.kind)}
              onEdit={edit}
              onOpenPlant={(id) => router.push(`/(app)/plant/${id}`)}
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
