import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, StyleSheet, View } from "react-native";

import { TourAnchor } from "@/components/tour/TourAnchor";
import { CheckPop } from "@/components/ui/CheckPop";
import { RipplePressable } from "@/components/ui/RipplePressable";
import { Text } from "@/components/ui/Text";
import { theme } from "@/style/theme";
import { fontSize } from "@/style/typography";
import { formatShortDate } from "@/utils/format";
import { TASK_ICONS, TASK_LABELS } from "@/utils/taskLabels";
import { Task, parseDay } from "@/utils/tasks";

type TaskRowProps = {
  task: Task;
  loading: boolean;
  onComplete: () => void;
  onEdit: () => void;
  tourId?: string;
};

export function TaskRow({
  task,
  loading,
  onComplete,
  onEdit,
  tourId,
}: TaskRowProps) {
  const { t } = useTranslation("plants");
  const label = t(TASK_LABELS[task.kind]);
  const next = t("taskNextDate", {
    date: formatShortDate(parseDay(task.task.next_at)),
  });
  const status = task.done
    ? `${t("taskDoneLabel")}. ${next}`
    : task.overdue
      ? t("taskLate", { count: task.lateDays })
      : "";

  return (
    <RipplePressable
      onPress={onEdit}
      disabled={loading}
      style={styles.row}
      accessibilityRole="button"
      accessibilityLabel={[label, task.plant.nickname, status]
        .filter(Boolean)
        .join(". ")}
      accessibilityHint={t("taskEditHint")}
      accessibilityState={{ busy: loading }}
      accessibilityActions={
        task.done ? [] : [{ name: "complete", label: t("taskMarkDone") }]
      }
      onAccessibilityAction={(event) => {
        if (event.nativeEvent.actionName === "complete") onComplete();
      }}
    >
      {tourId && <TourAnchor id={tourId} />}
      <View style={[styles.icon, task.done && styles.iconDone]}>
        <MaterialCommunityIcons
          name={TASK_ICONS[task.kind]}
          size={18}
          color={task.done ? theme.text.tertiary : theme.primary.clay}
        />
      </View>

      <View style={styles.texts}>
        <Text style={[styles.label, task.done && styles.labelDone]}>
          {label}
        </Text>
        {task.done && <Text style={styles.next}>{next}</Text>}
      </View>

      {loading ? (
        <View style={styles.checkHit}>
          <ActivityIndicator size="small" color={theme.primary.clay} />
        </View>
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
          accessibilityLabel={t("taskMarkDone")}
        >
          <CheckPop checked={task.done} />
        </RipplePressable>
      )}
    </RipplePressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.s3,
    minHeight: 56,
    paddingLeft: theme.spacing.s4,
    paddingRight: theme.spacing.s3,
    paddingVertical: theme.spacing.s2,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: theme.functional.line,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.primary.claySoft,
  },
  iconDone: {
    backgroundColor: theme.surface.container,
  },
  texts: {
    flex: 1,
    gap: 1,
  },
  label: {
    fontSize: fontSize.s7,
    fontWeight: "500",
    color: theme.text.primary,
  },
  labelDone: {
    color: theme.text.tertiary,
    textDecorationLine: "line-through",
  },
  next: {
    fontSize: fontSize.s4,
    color: theme.text.tertiary,
  },
  checkHit: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 22,
  },
});
