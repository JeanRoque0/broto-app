import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { RipplePressable } from "@/components/ui/RipplePressable";
import { Text } from "@/components/ui/Text";
import { usePlantTasks } from "@/hooks/usePlantTasks";
import { usePlants, useUserCareEvents } from "@/hooks/usePlants";
import { useProfile } from "@/hooks/useProfile";
import { theme } from "@/style/theme";
import { fontSize, type } from "@/style/typography";
import { getCredits } from "@/utils/credits";
import {
  buildTasks,
  FREE_TASK_KINDS,
  startOfDay,
  TASK_KINDS,
} from "@/utils/tasks";

type TodaySummaryProps = {
  onOpenTasks: () => void;
};

export function TodaySummary({ onOpenTasks }: TodaySummaryProps) {
  const { t } = useTranslation("plants");
  const { plants } = usePlants();
  const { tasks: plantTasks } = usePlantTasks();
  const { data: events } = useUserCareEvents();
  const { data: profile } = useProfile();
  const fullAccess = getCredits(profile ?? null).fullAccess;
  const [day] = useState(() => startOfDay(new Date()));

  const summary = useMemo(() => {
    const today = buildTasks({
      plants,
      tasks: plantTasks,
      events: events ?? [],
      day,
      kinds: fullAccess ? TASK_KINDS : FREE_TASK_KINDS,
    });
    const open = today.filter((task) => !task.done);
    return {
      open: open.length,
      late: open.filter((task) => task.overdue).length,
      plants: new Set(open.map((task) => task.plant.id)).size,
      total: today.length,
    };
  }, [plants, plantTasks, events, fullAccess, day]);

  if (summary.total === 0) return null;

  const done = summary.open === 0;
  const title = done
    ? t("summaryDone")
    : t("summaryTitle", { count: summary.open });
  const detail = done
    ? t("summaryDoneText")
    : [
        t("summaryPlants", { count: summary.plants }),
        summary.late > 0 ? t("summaryLate", { count: summary.late }) : null,
      ]
        .filter(Boolean)
        .join(" · ");

  return (
    <RipplePressable
      onPress={onOpenTasks}
      pressScale={0.98}
      style={[styles.card, done && styles.cardDone]}
      accessibilityRole="button"
      accessibilityLabel={`${title}. ${detail}`}
      accessibilityHint={t("summaryAction")}
    >
      <View style={[styles.icon, done && styles.iconDone]}>
        <MaterialCommunityIcons
          name={done ? "check-circle-outline" : "watering-can-outline"}
          size={22}
          color={done ? theme.secondary.moss : theme.text.onPrimary}
        />
      </View>

      <View style={styles.texts}>
        <Text style={styles.title}>{title}</Text>
        <Text style={[styles.detail, summary.late > 0 && styles.detailLate]}>
          {detail}
        </Text>
      </View>

      {!done && (
        <Feather name="chevron-right" size={18} color={theme.primary.clay} />
      )}
    </RipplePressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.s3,
    padding: theme.spacing.s4,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.primary.clayBorder,
    backgroundColor: theme.primary.clayTint,
  },
  cardDone: {
    borderColor: theme.functional.line,
    backgroundColor: theme.secondary.mossSoft,
  },
  icon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.primary.clay,
  },
  iconDone: {
    backgroundColor: theme.surface.card,
  },
  texts: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: fontSize.s8,
    fontWeight: "700",
    color: theme.text.primary,
  },
  detail: {
    ...type.bodySm,
  },
  detailLate: {
    color: theme.primary.clay,
  },
});
