import { Platform } from "react-native";

import i18n from "@/i18n";

import { loadNotifications } from "./notificationsModule";

const CHANNEL = "care-reminders";

export async function configureNotifications() {
  const Notifications = await loadNotifications();
  if (!Notifications) return;

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });

  ensureChannel();
  Notifications.cancelAllScheduledNotificationsAsync();
}

export async function getNotificationPermission() {
  const Notifications = await loadNotifications();
  if (!Notifications) return null;

  return Notifications.getPermissionsAsync();
}

export async function ensureNotificationPermission() {
  const Notifications = await loadNotifications();
  if (!Notifications) return false;

  const current = await Notifications.getPermissionsAsync();

  if (current.granted) return true;
  if (!current.canAskAgain) return false;

  const asked = await Notifications.requestPermissionsAsync();
  return asked.granted;
}

export async function ensureChannel() {
  if (Platform.OS !== "android") return;

  const Notifications = await loadNotifications();
  if (!Notifications) return;

  await Notifications.setNotificationChannelAsync(CHANNEL, {
    name: i18n.t("notifications:channelName"),
    importance: Notifications.AndroidImportance.DEFAULT,
    vibrationPattern: [0, 250],
    enableVibrate: true,
  });
}

export async function clearScheduledLegacy() {
  const Notifications = await loadNotifications();
  if (!Notifications) return;

  await Notifications.cancelAllScheduledNotificationsAsync();
}
