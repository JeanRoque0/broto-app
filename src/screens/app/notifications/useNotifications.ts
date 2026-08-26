import * as Notifications from "expo-notifications";
import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Linking } from "react-native";

import { usePlants } from "@/hooks/usePlants";
import { usePlantTasks } from "@/hooks/usePlantTasks";
import { getCredits } from "@/utils/credits";
import { remindableTasks } from "@/utils/tasks";
import { useProfile, useUpdateProfile } from "@/hooks/useProfile";
import {
  cancelCareReminders,
  ensureNotificationPermission,
  rescheduleCareReminders,
} from "@/services/notifications";

export function useNotificationSettings() {
  const { data: profile } = useProfile();
  const { data: plants } = usePlants();
  const { tasks: allTasks } = usePlantTasks();
  const tasks = remindableTasks(allTasks, getCredits(profile ?? null).isPro);
  const { mutate: updateProfile, isPending: saving } = useUpdateProfile();

  const [blocked, setBlocked] = useState(false);
  const [scheduled, setScheduled] = useState(0);
  const [upcoming, setUpcoming] = useState<
    { id: string; at: Date; title: string; body: string }[]
  >([]);
  const [timeVisible, setTimeVisible] = useState(false);
  const [applying, setApplying] = useState(false);

  const stored = profile?.notifications_enabled ?? true;
  const [enabled, setEnabled] = useState(stored);
  const reminderTime = profile?.reminder_time ?? "09:00";

  useEffect(() => {
    setEnabled(stored);
  }, [stored]);

  const refreshCount = useCallback(async () => {
    const list = await Notifications.getAllScheduledNotificationsAsync();
    setScheduled(list.length);

    const rows = list
      .map((item) => {
        const trigger = item.trigger as { value?: number; date?: number };
        const stamp = trigger?.value ?? trigger?.date;

        return {
          id: item.identifier,
          at: stamp ? new Date(stamp) : null,
          title: item.content.title ?? "",
          body: item.content.body ?? "",
        };
      })
      .filter(
        (
          item,
        ): item is { id: string; at: Date; title: string; body: string } =>
          !!item.at,
      )
      .sort((a, b) => a.at.getTime() - b.at.getTime());

    setUpcoming(rows);

    return list.length;
  }, []);

  useEffect(() => {
    Notifications.getPermissionsAsync().then((status) => {
      setBlocked(!status.granted && !status.canAskAgain);
    });
    refreshCount();
  }, [refreshCount]);

  const run = useCallback(
    async (nextEnabled: boolean, nextTime: string) => {
      if (!nextEnabled) {
        await cancelCareReminders();
        setScheduled(0);
        setUpcoming([]);
        return;
      }

      const granted = await ensureNotificationPermission();

      if (!granted) {
        const status = await Notifications.getPermissionsAsync();
        setBlocked(!status.canAskAgain);
        setScheduled(0);
        setUpcoming([]);
        return;
      }

      setBlocked(false);

      await rescheduleCareReminders({
        tasks,
        plants: plants ?? [],
        reminderTime: nextTime,
        enabled: true,
        chatNudge: true,
      });

      await refreshCount();
    },
    [tasks, plants, refreshCount],
  );

  const apply = useCallback(
    async (nextEnabled: boolean, nextTime: string) => {
      setApplying(true);

      try {
        await run(nextEnabled, nextTime);
      } finally {
        setApplying(false);
      }
    },
    [run],
  );
  useFocusEffect(
    useCallback(() => {
      let alive = true;

      (async () => {
        const found = await refreshCount();
        if (!alive || found > 0) return;
        if (!enabled || tasks.length === 0) return;

        await apply(enabled, reminderTime);
      })();

      return () => {
        alive = false;
      };
    }, [refreshCount, apply, enabled, reminderTime, tasks.length]),
  );

  function toggle() {
    const next = !enabled;
    setEnabled(next);
    updateProfile({ notifications_enabled: next });
    apply(next, reminderTime);
  }

  function saveTime(value: string) {
    setTimeVisible(false);
    updateProfile({ reminder_time: value });
    apply(enabled, value);
  }

  return {
    enabled,
    reminderTime,
    blocked,
    scheduled,
    upcoming,
    applying,
    saving,
    hasTasks: tasks.length > 0,
    toggle,
    saveTime,
    timeVisible,
    openTime: () => setTimeVisible(true),
    closeTime: () => setTimeVisible(false),
    openSettings: () => Linking.openSettings(),
  };
}
