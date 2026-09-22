import Constants, { ExecutionEnvironment } from "expo-constants";
import { Platform } from "react-native";

type NotificationsModule = typeof import("expo-notifications");

export const notificationsAvailable =
  Platform.OS !== "web" &&
  Constants.executionEnvironment !== ExecutionEnvironment.StoreClient;

let loading: Promise<NotificationsModule | null> | null = null;

export function loadNotifications() {
  if (!notificationsAvailable) return Promise.resolve(null);
  loading ??= import("expo-notifications");
  return loading;
}
