import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";

function isCare(response: Notifications.NotificationResponse | null) {
  const data = response?.notification.request.content.data;
  return data?.kind === "care";
}

export function useNotificationTap() {
  const router = useRouter();
  const handled = useRef(false);

  useEffect(() => {
    function open() {
      router.push({ pathname: "/(app)/(tabs)", params: { tab: "tasks" } });
    }

    Notifications.getLastNotificationResponseAsync().then((response) => {
      if (handled.current || !isCare(response)) return;
      handled.current = true;
      open();
    });

    const listener = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        if (!isCare(response)) return;
        open();
      },
    );

    return () => listener.remove();
  }, [router]);
}
