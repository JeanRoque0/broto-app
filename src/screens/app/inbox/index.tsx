import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, View } from "react-native";

import { Appear } from "@/components/ui/Appear";
import { Container } from "@/components/ui/Container";
import { EmptyState } from "@/components/ui/EmptyState";
import { Header } from "@/components/ui/Header";
import { RipplePressable } from "@/components/ui/RipplePressable";
import { PlantListSkeleton } from "@/components/ui/Skeleton";
import { Text } from "@/components/ui/Text";
import { useNotificationInbox } from "@/hooks/useNotificationInbox";
import { ReminderEvent, ReminderKind } from "@/types/reminder";
import { theme } from "@/style/theme";
import { formatLongDate } from "@/utils/format";
import { isSameDay, startOfDay } from "@/utils/tasks";

import { styles } from "./style";

const ICONS: Record<
  ReminderKind,
  React.ComponentProps<typeof MaterialCommunityIcons>["name"]
> = {
  care: "watering-can-outline",
  late: "clock-alert-outline",
  chat: "chat-outline",
  notice: "bullhorn-outline",
};

type Day = { key: string; date: Date; entries: ReminderEvent[] };

function groupByDay(entries: ReminderEvent[]) {
  const days: Day[] = [];
  for (const entry of entries) {
    const date = startOfDay(new Date(entry.sent_at));
    const last = days[days.length - 1];
    if (last && isSameDay(last.date, date)) {
      last.entries.push(entry);
    } else {
      days.push({ key: date.toISOString(), date, entries: [entry] });
    }
  }
  return days;
}

export default function InboxScreen() {
  const { t } = useTranslation("notifications");
  const router = useRouter();
  const { entries, loading } = useNotificationInbox();
  const days = useMemo(() => groupByDay(entries), [entries]);

  function dayLabel(date: Date) {
    const today = startOfDay(new Date());
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    if (isSameDay(date, today)) return t("inboxToday");
    if (isSameDay(date, yesterday)) return t("inboxYesterday");
    return formatLongDate(date);
  }

  function open(entry: ReminderEvent) {
    if (entry.kind === "chat") {
      router.push("/(app)/(tabs)/chat");
      return;
    }

    if (entry.kind === "notice") {
      router.push("/(app)/(tabs)");
      return;
    }

    if (entry.plant_id) router.push(`/(app)/plant/${entry.plant_id}`);
  }

  if (loading) {
    return (
      <Container>
        <Header showBack title={t("inboxTitle")} />
        <PlantListSkeleton rows={4} />
      </Container>
    );
  }

  return (
    <Container>
      <Header showBack title={t("inboxTitle")} />

      {entries.length === 0 ? (
        <EmptyState
          illustration={
            <MaterialCommunityIcons
              name="bell-check-outline"
              size={40}
              color={theme.illustration.leaf}
            />
          }
          title={t("inboxEmptyTitle")}
          description={t("inboxEmptyText")}
        />
      ) : (
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.keep}>{t("inboxKeepNote")}</Text>

          {days.map((day, position) => (
            <Appear key={day.key} index={position} style={styles.day}>
              <Text style={styles.dayLabel} accessibilityRole="header">
                {dayLabel(day.date)}
              </Text>

              <View style={styles.card}>
                {day.entries.map((entry, index) => {
                  const late = entry.kind === "late";

                  return (
                    <RipplePressable
                      key={entry.id}
                      onPress={() => open(entry)}
                      style={[styles.row, index > 0 && styles.rowDivider]}
                      accessibilityRole="button"
                      accessibilityLabel={`${entry.title}: ${entry.body}`}
                    >
                      <View
                        style={[styles.rowIcon, late && styles.rowIconLate]}
                      >
                        <MaterialCommunityIcons
                          name={ICONS[entry.kind]}
                          size={18}
                          color={
                            late ? theme.primary.clay : theme.secondary.moss
                          }
                        />
                      </View>

                      <View style={styles.rowTexts}>
                        <Text style={styles.rowTitle} numberOfLines={1}>
                          {entry.title}
                        </Text>
                        <Text style={styles.rowBody} numberOfLines={2}>
                          {entry.body}
                        </Text>
                      </View>

                      {!entry.read_at && <View style={styles.dot} />}
                    </RipplePressable>
                  );
                })}
              </View>
            </Appear>
          ))}
        </ScrollView>
      )}
    </Container>
  );
}
