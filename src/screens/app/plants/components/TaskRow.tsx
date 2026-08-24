import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, StyleSheet, View } from "react-native";

import { RipplePressable } from "@/components/ui/RipplePressable";
import { Text } from "@/components/ui/Text";
import { theme } from "@/style/theme";
import { fontSize, type } from "@/style/typography";
import { formatShortDate } from "@/utils/format";
import { TASK_ICONS, TASK_LABELS } from "@/utils/taskLabels";
import { Task, parseDay } from "@/utils/tasks";

type TaskRowProps = {
  task: Task;
  loading: boolean;
  onComplete: () => void;
  onEdit: () => void;
};

export function TaskRow({ task, loading, onComplete, onEdit }: TaskRowProps) {
  const { t } = useTranslation("plants");

  return (
    <RipplePressable
      onPress={onEdit}
      disabled={loading}
      style={styles.row}
      accessibilityRole="button"
      accessibilityLabel={`${t(TASK_LABELS[task.kind])} ${task.plant.nickname}`}
    >
      <View style={[styles.icon, task.done && styles.iconDone]}>
        <MaterialCommunityIcons
          name={TASK_ICONS[task.kind]}
          size={20}
          color={task.done ? theme.text.tertiary : theme.primary.clay}
        />
      </View>

      <View style={styles.texts}>
        <Text style={[styles.label, task.done && styles.labelDone]}>
          {t(TASK_LABELS[task.kind])}
        </Text>
        <Text style={styles.plant} numberOfLines={1}>
          {task.plant.nickname}
        </Text>

        {task.done ? (
          <View style={styles.doneBlock}>
            <Text family="mono" style={styles.doneLabel}>
              {t("taskDoneLabel")}
            </Text>
            <Text family="mono" style={styles.nextLabel}>
              {t("taskNextDate", {
                date: formatShortDate(parseDay(task.task.next_at)),
              })}
            </Text>
          </View>
        ) : (
          task.overdue && (
            <Text family="mono" style={styles.late}>
              {t("taskLate", { count: task.lateDays })}
            </Text>
          )
        )}
      </View>

      {loading ? (
        <ActivityIndicator size="small" color={theme.primary.clay} />
      ) : (
        <RipplePressable
          onPress={task.done ? undefined : onComplete}
          disabled={task.done}
          borderless
          radius={22}
          hitSlop={10}
          style={styles.checkHit}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: task.done }}
        >
          <View style={[styles.check, task.done && styles.checkDone]}>
            {task.done && (
              <Feather name="check" size={15} color={theme.text.onPrimary} />
            )}
          </View>
        </RipplePressable>
      )}
    </RipplePressable>
  );
}

const styles = StyleSheet.create({
  row: {
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
  icon: {
    width: 44,
    height: 44,
    borderRadius: theme.radius.field,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.primary.clayTint,
    borderWidth: 1,
    borderColor: theme.primary.clayBorder,
  },
  iconDone: {
    backgroundColor: theme.surface.container,
    borderColor: theme.functional.line,
  },
  texts: {
    flex: 1,
    gap: 1,
  },
  label: {
    fontSize: fontSize.s6,
    fontWeight: "700",
    color: theme.text.primary,
  },
  labelDone: {
    fontWeight: "400",
    color: theme.text.tertiary,
    textDecorationLine: "line-through",
  },
  plant: {
    ...type.bodySm,
  },
  late: {
    fontSize: fontSize.s2,
    color: theme.primary.clay,
  },
  doneBlock: {
    gap: 1,
    marginTop: 1,
  },
  doneLabel: {
    fontSize: fontSize.s2,
    color: theme.secondary.moss,
  },
  nextLabel: {
    fontSize: fontSize.s2,
    color: theme.text.tertiary,
  },
  checkHit: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
  },
  check: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1.6,
    borderColor: theme.functional.lineStrong,
    alignItems: "center",
    justifyContent: "center",
  },
  checkDone: {
    backgroundColor: theme.secondary.moss,
    borderColor: theme.secondary.moss,
  },
});
