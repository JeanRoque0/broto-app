import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";

import {
  LogEntry,
  countUnread,
  listDelivered,
  markAllRead,
} from "@/services/notificationLog";

export function useUnreadNotifications() {
  const [unread, setUnread] = useState(0);

  useFocusEffect(
    useCallback(() => {
      countUnread().then(setUnread);
    }, []),
  );

  return unread;
}

export function useNotificationInbox() {
  const [entries, setEntries] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const list = await listDelivered();
    setEntries(list);
    setLoading(false);
    await markAllRead();
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  return { entries, loading };
}
