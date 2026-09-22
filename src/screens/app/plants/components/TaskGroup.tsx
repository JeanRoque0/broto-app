import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { PlantPhoto } from "@/components/PlantPhoto";
import { RipplePressable } from "@/components/ui/RipplePressable";
import { Text } from "@/components/ui/Text";
import { theme } from "@/style/theme";
import { fontSize } from "@/style/typography";
import { Task } from "@/utils/tasks";

import { TaskRow } from "./TaskRow";

type TaskGroupProps = {
  tasks: Task[];
  pending: string | null;
  onComplete: (task: Task) => void;
  onEdit: (task: Task) => void;
  onOpenPlant: (plantId: string) => void;
  tourId?: string;
};

export function TaskGroup({
  tasks,
  pending,
  onComplete,
  onEdit,
  onOpenPlant,
  tourId,
}: TaskGroupProps) {
  const { t } = useTranslation("plants");
  const plant = tasks[0].plant;
  const open = tasks.filter((task) => !task.done);
  const lateDays = Math.max(0, ...open.map((task) => task.lateDays));

  const status =
    open.length === 0
      ? t("taskGroupDone")
      : lateDays > 0
        ? t("taskLate", { count: lateDays })
        : t("taskGroupCount", { count: open.length });

  const tone =
    open.length === 0
      ? styles.statusDone
      : lateDays > 0
        ? styles.statusLate
        : null;

  return (
    <View style={styles.card}>
      <RipplePressable
        onPress={() => onOpenPlant(plant.id)}
        style={styles.head}
        accessibilityRole="button"
        accessibilityLabel={`${plant.nickname}. ${status}`}
      >
        <PlantPhoto path={plant.photo_path} style={styles.photo} />
        <View style={styles.headTexts}>
          <Text style={styles.name} numberOfLines={1}>
            {plant.nickname}
          </Text>
          <Text style={[styles.status, tone]}>{status}</Text>
        </View>
      </RipplePressable>

      {tasks.map((task, index) => (
        <TaskRow
          key={task.kind}
          tourId={index === 0 ? tourId : undefined}
          task={task}
          loading={pending === `${task.plant.id}:${task.kind}`}
          onComplete={() => onComplete(task)}
          onEdit={() => onEdit(task)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: theme.spacing.s3,
    backgroundColor: theme.surface.card,
    borderWidth: 1,
    borderColor: theme.functional.line,
    borderRadius: theme.radius.lg,
    overflow: "hidden",
  },
  head: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.s3,
    paddingHorizontal: theme.spacing.s4,
    paddingTop: theme.spacing.s4,
    paddingBottom: theme.spacing.s2,
  },
  photo: {
    width: 40,
    height: 40,
    borderRadius: theme.radius.sm,
  },
  headTexts: {
    flex: 1,
    gap: 1,
  },
  name: {
    fontSize: fontSize.s8,
    fontWeight: "700",
    color: theme.text.primary,
  },
  status: {
    fontSize: fontSize.s4,
    fontWeight: "500",
    color: theme.text.secondary,
  },
  statusLate: {
    color: theme.primary.clay,
  },
  statusDone: {
    color: theme.secondary.moss,
  },
});
