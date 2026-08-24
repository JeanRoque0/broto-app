import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { RipplePressable } from "@/components/ui/RipplePressable";
import { Text } from "@/components/ui/Text";
import { theme } from "@/style/theme";
import { fontSize } from "@/style/typography";
import { PlantTask } from "@/types/plant";
import { formatShortDate } from "@/utils/format";
import { TASK_ICONS, TASK_LABELS } from "@/utils/taskLabels";
import { TASK_KINDS, isTaskKind, parseDay } from "@/utils/tasks";

type CareRoutineProps = {
  tasks: PlantTask[];
  onEdit?: (task: PlantTask) => void;
  lockedKinds?: readonly string[];
  onLocked?: () => void;
};

export function CareRoutine({
  tasks,
  onEdit,
  lockedKinds = [],
  onLocked,
}: CareRoutineProps) {
  const { t } = useTranslation("plants");

  const ordered = TASK_KINDS.map((kind) =>
    tasks.find((task) => task.kind === kind),
  ).filter((task): task is PlantTask => !!task);

  return (
    <View style={styles.list}>
      {ordered.map((task) => {
        if (!isTaskKind(task.kind)) return null;

        const locked = lockedKinds.includes(task.kind);
        const dimmed = locked || !task.enabled;

        const row = (
          <>
            <View style={[styles.icon, dimmed && styles.iconOff]}>
              <MaterialCommunityIcons
                name={TASK_ICONS[task.kind]}
                size={18}
                color={dimmed ? theme.text.tertiary : theme.primary.clay}
              />
            </View>

            <View style={styles.texts}>
              <Text style={[styles.label, dimmed && styles.labelOff]}>
                {t(TASK_LABELS[task.kind])}
              </Text>

              <Text family="mono" style={styles.detail}>
                {locked
                  ? t("careTaskLocked")
                  : task.enabled
                    ? `${t("taskEveryDays", { count: task.interval_days })} · ${formatShortDate(parseDay(task.next_at))}`
                    : t("careTaskOff")}
              </Text>
            </View>

            {onEdit && (
              <Feather
                name={locked ? "lock" : "chevron-right"}
                size={locked ? 15 : 17}
                color={locked ? theme.secondary.ochre : theme.text.secondary}
              />
            )}
          </>
        );

        if (!onEdit) {
          return (
            <View key={task.id} style={styles.row}>
              {row}
            </View>
          );
        }

        return (
          <RipplePressable
            key={task.id}
            onPress={() => (locked ? onLocked?.() : onEdit(task))}
            style={[styles.row, locked && styles.rowLocked]}
            accessibilityRole="button"
          >
            {row}
          </RipplePressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: theme.spacing.s2,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.s3,
    paddingVertical: theme.spacing.s2,
    paddingLeft: theme.spacing.s2,
    paddingRight: theme.spacing.s4,
    borderRadius: theme.radius.md,
    backgroundColor: theme.surface.card,
  },
  rowLocked: {
    backgroundColor: theme.surface.container,
  },
  icon: {
    width: 38,
    height: 38,
    borderRadius: theme.radius.field,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.primary.clayTint,
    borderWidth: 1,
    borderColor: theme.primary.clayBorder,
  },
  iconOff: {
    backgroundColor: theme.surface.container,
    borderColor: theme.functional.line,
  },
  texts: {
    flex: 1,
    gap: 1,
  },
  label: {
    fontSize: fontSize.s6,
    fontWeight: "500",
    color: theme.text.primary,
  },
  labelOff: {
    color: theme.text.tertiary,
  },
  detail: {
    fontSize: fontSize.s3,
    color: theme.text.secondary,
  },
});
