import * as Notifications from "expo-notifications";
import { useRootNavigationState, useRouter } from "expo-router";
import { useEffect } from "react";

import { useAuth } from "@/hooks/useAuth";

export function useNotificationNavigation() {
  const router = useRouter();
  const navigationState = useRootNavigationState();
  const { isAuthenticated, hydrated } = useAuth();
  const response = Notifications.useLastNotificationResponse();

  useEffect(() => {
    if (!response || !navigationState?.key || !hydrated || !isAuthenticated) {
      return;
    }

    if (response.actionIdentifier !== Notifications.DEFAULT_ACTION_IDENTIFIER) {
      return;
    }

    const data = response.notification.request.content.data;
    const plantId = data?.plantId;

    Notifications.clearLastNotificationResponse();

    if (data?.kind === "chat") {
      router.push("/(app)/(tabs)/chat");
      return;
    }

    if (typeof plantId === "string" && plantId) {
      router.push(`/(app)/plant/${plantId}`);
    }
  }, [response, navigationState?.key, hydrated, isAuthenticated, router]);
}
