import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

import { NOTIFICATION_WINDOW } from "@/constants";
import i18n from "@/i18n";
import { PlantTask } from "@/types/plant";
import { isTaskKind, parseDay, startOfDay } from "@/utils/tasks";

import { recordPlanned } from "./notificationLog";

const CHANNEL = "care-reminders";

export function configureNotifications() {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });
}

export async function ensureNotificationPermission() {
  const current = await Notifications.getPermissionsAsync();

  if (current.granted) return true;
  if (!current.canAskAgain) return false;

  const asked = await Notifications.requestPermissionsAsync();
  return asked.granted;
}

async function ensureChannel() {
  if (Platform.OS !== "android") return;

  await Notifications.setNotificationChannelAsync(CHANNEL, {
    name: i18n.t("notifications:channelName"),
    importance: Notifications.AndroidImportance.DEFAULT,
    vibrationPattern: [0, 250],
    enableVibrate: true,
  });
}

function parseTime(value: string | null) {
  const [hour, minute] = (value ?? "09:00").split(":").map(Number);
  return {
    hour: Number.isFinite(hour) ? hour : 9,
    minute: Number.isFinite(minute) ? minute : 0,
  };
}

interface ScheduleParams {
  tasks: PlantTask[];
  reminderTime: string | null;
  enabled: boolean;
}

export async function rescheduleCareReminders({
  tasks,
  reminderTime,
  enabled,
}: ScheduleParams) {
  await Notifications.cancelAllScheduledNotificationsAsync();

  if (!enabled) return 0;

  const granted = await ensureNotificationPermission();
  if (!granted) return 0;

  await ensureChannel();

  const { hour, minute } = parseTime(reminderTime);
  const today = startOfDay(new Date());
  const byDay = new Map<number, Set<string>>();

  for (const task of tasks) {
    if (!task.enabled) continue;
    if (!isTaskKind(task.kind)) continue;

    const due = startOfDay(parseDay(task.next_at));
    if (due.getTime() < today.getTime()) continue;

    const key = due.getTime();
    const plants = byDay.get(key) ?? new Set<string>();
    plants.add(task.plant_id);
    byDay.set(key, plants);
  }

  const days = [...byDay.entries()]
    .sort((a, b) => a[0] - b[0])
    .slice(0, NOTIFICATION_WINDOW);

  const now = Date.now();
  const planned: { id: string; at: number; count: number }[] = [];
  let scheduled = 0;

  for (const [time, plants] of days) {
    const count = plants.size;
    const fireAt = new Date(time);
    fireAt.setHours(hour, minute, 0, 0);

    if (fireAt.getTime() <= now) continue;

    await Notifications.scheduleNotificationAsync({
      content: {
        title: i18n.t("notifications:reminderTitle"),
        body: i18n.t("notifications:reminderBody", { count }),
        data: { kind: "care", day: time },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: fireAt,
        channelId: Platform.OS === "android" ? CHANNEL : undefined,
      },
    });

    planned.push({ id: String(time), at: fireAt.getTime(), count });
    scheduled += 1;
  }

  await recordPlanned(planned);

  return scheduled;
}

export async function cancelCareReminders() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}
