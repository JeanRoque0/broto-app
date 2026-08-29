import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";

import { useAuth } from "@/hooks/useAuth";

import {
  LogEntry,
  countUnread,
  listDelivered,
  markAllRead,
} from "@/services/notificationLog";

export function useUnreadNotifications() {
  const { userId } = useAuth();
  const [unread, setUnread] = useState(0);

  useFocusEffect(
    useCallback(() => {
      if (!userId) return;
      countUnread(userId).then(setUnread);
    }, [userId]),
  );

  return unread;
}

export function useNotificationInbox() {
  const { userId } = useAuth();
  const [entries, setEntries] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!userId) return;

    const list = await listDelivered(userId);
    setEntries(list);
    setLoading(false);
    await markAllRead(userId);
  }, [userId]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  return { entries, loading };
}
