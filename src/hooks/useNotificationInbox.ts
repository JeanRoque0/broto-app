import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useFocusEffect } from "expo-router";
import { useCallback, useEffect } from "react";

import { useAuth } from "@/hooks/useAuth";
import {
  countUnreadReminders,
  listReminderEvents,
  markRemindersRead,
} from "@/services/supabase/reminders";

export const reminderKeys = {
  list: (userId: string) => ["reminders", userId] as const,
  unread: (userId: string) => ["reminders", userId, "unread"] as const,
};

export function useUnreadNotifications() {
  const { userId } = useAuth();

  const { data, refetch } = useQuery({
    queryKey: reminderKeys.unread(userId ?? ""),
    queryFn: () => countUnreadReminders(userId!),
    enabled: !!userId,
  });

  useFocusEffect(
    useCallback(() => {
      if (userId) refetch();
    }, [userId, refetch]),
  );

  return data ?? 0;
}

export function useNotificationInbox() {
  const { userId } = useAuth();
  const queryClient = useQueryClient();

  const { data, isLoading, refetch } = useQuery({
    queryKey: reminderKeys.list(userId ?? ""),
    queryFn: () => listReminderEvents(userId!),
    enabled: !!userId,
  });

  const read = useMutation({
    mutationFn: () => markRemindersRead(userId!),
    onSuccess: () => {
      queryClient.setQueryData(reminderKeys.unread(userId!), 0);
    },
  });

  useFocusEffect(
    useCallback(() => {
      if (userId) refetch();
    }, [userId, refetch]),
  );

  useEffect(() => {
    if (!userId || isLoading) return;
    if (!data?.some((entry) => !entry.read_at)) return;

    read.mutate();
  }, [userId, isLoading, data, read]);

  return { entries: data ?? [], loading: isLoading };
}
