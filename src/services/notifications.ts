import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

import {
  CHAT_NUDGE_DAYS,
  DEFAULT_REMINDER_TIME,
  NOTIFICATION_LIMIT,
} from "@/constants";
import i18n from "@/i18n";
import { Plant, PlantTask } from "@/types/plant";
import { TASK_LABELS } from "@/utils/taskLabels";
import { isTaskKind, parseDay, startOfDay } from "@/utils/tasks";

import { clearLog, LogEntry, recordPlanned } from "./notificationLog";

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

function parseTime(value: string | null | undefined, fallback: string | null) {
  const [hour, minute] = (value ?? fallback ?? DEFAULT_REMINDER_TIME)
    .slice(0, 5)
    .split(":")
    .map(Number);

  return {
    hour: Number.isFinite(hour) ? hour : 9,
    minute: Number.isFinite(minute) ? minute : 0,
  };
}

function joinLabels(labels: string[]) {
  if (labels.length <= 1) return labels[0] ?? "";

  const last = labels[labels.length - 1];
  const rest = labels.slice(0, -1).join(", ");

  return `${rest} ${i18n.t("notifications:listAnd")} ${last}`;
}

type Slot = {
  key: string;
  plant: Plant;
  at: Date;
  kinds: string[];
  late: number;
};

function buildSlots(tasks: PlantTask[], plants: Plant[], fallback: string | null) {
  const byId = new Map(plants.map((plant) => [plant.id, plant]));
  const today = startOfDay(new Date());
  const now = new Date();
  const slots = new Map<string, Slot>();

  for (const task of tasks) {
    if (!task.enabled || !isTaskKind(task.kind)) continue;

    const plant = byId.get(task.plant_id);
    if (!plant) continue;

    const due = startOfDay(parseDay(task.next_at));
    const { hour, minute } = parseTime(task.remind_at, fallback);

    const overdue = Math.round(
      (today.getTime() - due.getTime()) / (24 * 60 * 60 * 1000),
    );

    const fireAt = new Date(overdue > 0 ? today : due);
    fireAt.setHours(hour, minute, 0, 0);

    if (fireAt.getTime() <= now.getTime()) {
      if (overdue <= 0) continue;
      fireAt.setDate(fireAt.getDate() + 1);
    }

    const key = `${plant.id}:${fireAt.getTime()}`;
    const slot = slots.get(key) ?? {
      key,
      plant,
      at: fireAt,
      kinds: [],
      late: 0,
    };

    slot.kinds.push(task.kind);
    slot.late = Math.max(slot.late, overdue);
    slots.set(key, slot);
  }

  return [...slots.values()].sort((a, b) => a.at.getTime() - b.at.getTime());
}

function slotContent(slot: Slot) {
  const labels = slot.kinds.map((kind) =>
    i18n.t(`plants:${TASK_LABELS[kind as keyof typeof TASK_LABELS]}`),
  );

  return {
    title: slot.plant.nickname,
    body:
      slot.late > 0
        ? i18n.t("notifications:lateBody", {
            count: slot.late,
            tasks: joinLabels(labels),
          })
        : i18n.t("notifications:careBody", { tasks: joinLabels(labels) }),
  };
}

interface ScheduleParams {
  userId: string;
  tasks: PlantTask[];
  plants: Plant[];
  reminderTime: string | null;
  enabled: boolean;
  chatNudge: boolean;
  notice?: NoticeSlot | null;
}

export interface NoticeSlot {
  id: string;
  title: string;
  body: string;
  at: Date;
}

export async function rescheduleCareReminders({
  userId,
  tasks,
  plants,
  reminderTime,
  enabled,
  chatNudge,
  notice,
}: ScheduleParams) {
  await Notifications.cancelAllScheduledNotificationsAsync();

  if (!enabled) return 0;

  const granted = await ensureNotificationPermission();
  if (!granted) return 0;

  await ensureChannel();

  const slots = buildSlots(tasks, plants, reminderTime).slice(
    0,
    NOTIFICATION_LIMIT,
  );

  const planned: Omit<LogEntry, "read">[] = [];

  if (notice && notice.at.getTime() > Date.now()) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: notice.title,
        body: notice.body,
        data: { kind: "notice" },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: notice.at,
        channelId: Platform.OS === "android" ? CHANNEL : undefined,
      },
    });

    planned.push({
      id: `notice:${notice.id}`,
      at: notice.at.getTime(),
      kind: "notice",
      plantId: null,
      title: notice.title,
      body: notice.body,
    });
  }

  for (const slot of slots) {
    const { title, body } = slotContent(slot);
    const kind = slot.late > 0 ? "late" : "care";

    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data: { kind, plantId: slot.plant.id },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: slot.at,
        channelId: Platform.OS === "android" ? CHANNEL : undefined,
      },
    });

    planned.push({
      id: slot.key,
      at: slot.at.getTime(),
      kind,
      plantId: slot.plant.id,
      title,
      body,
    });
  }

  if (chatNudge && plants.length > 0) {
    const { hour, minute } = parseTime(null, reminderTime);
    const at = new Date();
    at.setDate(at.getDate() + CHAT_NUDGE_DAYS);
    at.setHours(hour, minute, 0, 0);

    const title = i18n.t("notifications:chatTitle");
    const body = i18n.t("notifications:chatBody");

    await Notifications.scheduleNotificationAsync({
      content: { title, body, data: { kind: "chat" } },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: at,
        channelId: Platform.OS === "android" ? CHANNEL : undefined,
      },
    });

    planned.push({
      id: `chat:${at.getTime()}`,
      at: at.getTime(),
      kind: "chat",
      plantId: null,
      title,
      body,
    });
  }

  await recordPlanned(userId, planned);

  return planned.length;
}

export async function resetReminders(userId: string) {
  await Notifications.cancelAllScheduledNotificationsAsync();
  await clearLog(userId);
}

export async function cancelCareReminders() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}
