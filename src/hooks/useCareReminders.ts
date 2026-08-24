import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useRef } from "react";
import * as Localization from "expo-localization";

import { usePlantTasks } from "@/hooks/usePlantTasks";
import { useProfile, useUpdateProfile } from "@/hooks/useProfile";
import {
  configureNotifications,
  rescheduleCareReminders,
} from "@/services/notifications";
import { getCredits } from "@/utils/credits";
import { remindableTasks } from "@/utils/tasks";

export function useCareReminders() {
  const { data: profile } = useProfile();
  const { tasks } = usePlantTasks();
  const { mutate: updateProfile } = useUpdateProfile();
  const signature = useRef("");

  useEffect(() => {
    configureNotifications();
  }, []);

  useEffect(() => {
    if (!profile || profile.timezone) return;

    const zone = Localization.getCalendars()[0]?.timeZone;
    if (zone) updateProfile({ timezone: zone });
  }, [profile, updateProfile]);

  const sync = useCallback(() => {
    if (!profile) return;

    const active = remindableTasks(tasks, getCredits(profile).isPro);

    const next = [
      profile.notifications_enabled,
      profile.reminder_time,
      ...active.map((task) => `${task.id}:${task.next_at}`),
    ].join("|");

    if (next === signature.current) return;
    signature.current = next;

    rescheduleCareReminders({
      tasks: active,
      reminderTime: profile.reminder_time,
      enabled: profile.notifications_enabled,
    });
  }, [profile, tasks]);

  useFocusEffect(sync);
}
