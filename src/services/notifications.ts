import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

import i18n from "@/i18n";

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

  ensureChannel();
  Notifications.cancelAllScheduledNotificationsAsync();
}

export async function ensureNotificationPermission() {
  const current = await Notifications.getPermissionsAsync();

  if (current.granted) return true;
  if (!current.canAskAgain) return false;

  const asked = await Notifications.requestPermissionsAsync();
  return asked.granted;
}

export async function ensureChannel() {
  if (Platform.OS !== "android") return;

  await Notifications.setNotificationChannelAsync(CHANNEL, {
    name: i18n.t("notifications:channelName"),
    importance: Notifications.AndroidImportance.DEFAULT,
    vibrationPattern: [0, 250],
    enableVibrate: true,
  });
}

export async function clearScheduledLegacy() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}
