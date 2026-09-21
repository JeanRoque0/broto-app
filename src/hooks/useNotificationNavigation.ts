import type { NotificationResponse } from "expo-notifications";
import { useRootNavigationState, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";

import { useAuth } from "@/hooks/useAuth";
import { loadNotifications } from "@/services/notificationsModule";

const DEFAULT_ACTION = "expo.modules.notifications.actions.DEFAULT";

function useLastResponse() {
  const [response, setResponse] = useState<NotificationResponse | null>(null);

  useEffect(() => {
    let alive = true;
    let subscription: { remove: () => void } | null = null;

    loadNotifications().then((Notifications) => {
      if (!Notifications || !alive) return;

      const last = Notifications.getLastNotificationResponse();
      if (last) setResponse(last);

      subscription = Notifications.addNotificationResponseReceivedListener(
        (next) => setResponse(next),
      );
    });

    return () => {
      alive = false;
      subscription?.remove();
    };
  }, []);

  return response;
}

export function useNotificationNavigation() {
  const router = useRouter();
  const navigationState = useRootNavigationState();
  const { isAuthenticated, hydrated } = useAuth();
  const response = useLastResponse();
  const handled = useRef<string | null>(null);

  useEffect(() => {
    if (!response || !navigationState?.key || !hydrated || !isAuthenticated) {
      return;
    }

    if (response.actionIdentifier !== DEFAULT_ACTION) {
      return;
    }

    const id = response.notification.request.identifier;
    if (handled.current === id) return;
    handled.current = id;

    const data = response.notification.request.content.data;
    const plantId = data?.plantId;

    loadNotifications().then((Notifications) =>
      Notifications?.clearLastNotificationResponse(),
    );

    if (data?.kind === "chat") {
      router.push("/(app)/(tabs)/chat");
      return;
    }

    if (data?.kind === "notice") {
      router.push("/(app)/(tabs)");
      return;
    }

    if (typeof plantId === "string" && plantId) {
      router.push(`/(app)/plant/${plantId}`);
    }
  }, [response, navigationState?.key, hydrated, isAuthenticated, router]);
}
