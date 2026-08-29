import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useRef } from "react";
import * as Localization from "expo-localization";

import { useAnnouncement } from "@/hooks/useAnnouncement";
import { usePlants } from "@/hooks/usePlants";
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
  const { data: plants } = usePlants();
  const { mutate: updateProfile } = useUpdateProfile();
  const { announcement, title, body } = useAnnouncement();
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

    const notice =
      announcement?.notify_at && title
        ? {
            id: announcement.id,
            title,
            body,
            at: new Date(announcement.notify_at),
          }
        : null;

    const next = [
      profile.notifications_enabled,
      profile.reminder_time,
      notice?.id ?? "",
      ...active.map(
        (task) => `${task.id}:${task.next_at}:${task.remind_at ?? ""}`,
      ),
    ].join("|");

    if (next === signature.current) return;
    signature.current = next;

    rescheduleCareReminders({
      userId: profile.id,
      tasks: active,
      plants: plants ?? [],
      reminderTime: profile.reminder_time,
      enabled: profile.notifications_enabled,
      chatNudge: true,
      notice,
    });
  }, [profile, tasks, plants, announcement, title, body]);

  useFocusEffect(sync);
}
