import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";

import {
  LogEntry,
  clearLog,
  countUnread,
  listDelivered,
  markAllRead,
  removeEntry,
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

  async function remove(id: string) {
    const next = await removeEntry(id);
    setEntries(next.filter((entry) => entry.at <= Date.now()));
  }

  async function clear() {
    await clearLog();
    setEntries([]);
  }

  return { entries, loading, remove, clear };
}
