import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import Animated, {
  FadeOut,
  LinearTransition,
  ReduceMotion,
} from "react-native-reanimated";

import { Card } from "@/components/ui/Card";
import { CheckPop } from "@/components/ui/CheckPop";
import { RipplePressable } from "@/components/ui/RipplePressable";
import { Text } from "@/components/ui/Text";
import { theme } from "@/style/theme";
import { fontSize, type } from "@/style/typography";
import { formatShortDate } from "@/utils/format";
import { TASK_ICONS, TASK_LABELS } from "@/utils/taskLabels";
import { Task, isTaskKind, parseDay } from "@/utils/tasks";
import { PlantTask } from "@/types/plant";

type TodayCardProps = {
  tasks: Task[];
  upcoming: PlantTask | null;
  pending: string | null;
  onComplete: (kind: string) => void;
};

export function TodayCard({
  tasks,
  upcoming,
  pending,
  onComplete,
}: TodayCardProps) {
  const { t } = useTranslation("plants");

  if (tasks.length === 0) {
    return (
      <Card style={styles.card}>
        <Text family="display" style={styles.emptyTitle}>
          {t("todayEmpty")}
        </Text>

        {upcoming && isTaskKind(upcoming.kind) && (
          <Text style={styles.emptyHint}>
            {t("todayNext", {
              task: t(TASK_LABELS[upcoming.kind]),
              date: formatShortDate(parseDay(upcoming.next_at)),
            })}
          </Text>
        )}
      </Card>
    );
  }

  return (
    <Card style={styles.card}>
      <Text accessibilityRole="header" family="display" style={styles.title}>
        {t("todayTitle")}
      </Text>

      <View style={styles.list}>
        {tasks.map((task) => (
          <Animated.View
            key={task.kind}
            style={styles.row}
            exiting={FadeOut.duration(220).reduceMotion(ReduceMotion.System)}
            layout={LinearTransition.duration(240).reduceMotion(
              ReduceMotion.System,
            )}
          >
            <MaterialCommunityIcons
              name={TASK_ICONS[task.kind]}
              size={19}
              color={theme.primary.clay}
            />

            <View style={styles.texts}>
              <Text style={styles.label}>{t(TASK_LABELS[task.kind])}</Text>
              {task.overdue && (
                <Text family="mono" style={styles.late}>
                  {t("taskLate", { count: task.lateDays })}
                </Text>
              )}
            </View>

            {pending === task.kind ? (
              <ActivityIndicator size="small" color={theme.primary.clay} />
            ) : (
              <RipplePressable
                onPress={() => onComplete(task.kind)}
                borderless
                radius={20}
                hitSlop={10}
                style={styles.checkHit}
                accessibilityRole="button"
                accessibilityLabel={`${t("taskMarkDone")}: ${t(TASK_LABELS[task.kind])}`}
              >
                <CheckPop checked={false} />
              </RipplePressable>
            )}
          </Animated.View>
        ))}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: theme.spacing.s5,
    gap: theme.spacing.s3,
  },
  title: {
    ...type.displayXs,
  },
  emptyTitle: {
    ...type.displayXs,
  },
  emptyHint: {
    ...type.bodySm,
  },
  list: {
    gap: theme.spacing.s1,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.s3,
    paddingVertical: theme.spacing.s2,
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
  late: {
    fontSize: fontSize.s2,
    color: theme.primary.clay,
  },
  checkHit: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
  },
});
