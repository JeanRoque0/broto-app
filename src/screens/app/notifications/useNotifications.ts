import * as Notifications from "expo-notifications";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Linking } from "react-native";

import { DEFAULT_REMINDER_TIME } from "@/constants";
import { usePlants } from "@/hooks/usePlants";
import { usePlantTasks } from "@/hooks/usePlantTasks";
import { useProfile, useUpdateProfile } from "@/hooks/useProfile";
import { ensureNotificationPermission } from "@/services/notifications";
import { registerPushToken, unregisterPushToken } from "@/services/push";
import { getCredits } from "@/utils/credits";
import { TASK_LABELS } from "@/utils/taskLabels";
import { isTaskKind, parseDay, startOfDay , remindableTasks } from "@/utils/tasks";


const HORIZON = 20;

interface Upcoming {
  id: string;
  at: Date;
  title: string;
  body: string;
}

export function useNotificationSettings() {
  const { t: tPlants } = useTranslation("plants");
  const { data: profile } = useProfile();
  const { data: plants } = usePlants();
  const { tasks: allTasks } = usePlantTasks();
  const tasks = remindableTasks(allTasks, getCredits(profile ?? null).isPro);
  const { mutate: updateProfile, isPending: saving } = useUpdateProfile();

  const [blocked, setBlocked] = useState(false);
  const [applying, setApplying] = useState(false);

  const stored = profile?.notifications_enabled ?? true;
  const [enabled, setEnabled] = useState(stored);

  useEffect(() => {
    setEnabled(stored);
  }, [stored]);

  useEffect(() => {
    Notifications.getPermissionsAsync().then((status) => {
      setBlocked(!status.granted && !status.canAskAgain);
    });
  }, []);

  const upcoming = useMemo<Upcoming[]>(() => {
    if (!enabled) return [];

    const byId = new Map((plants ?? []).map((plant) => [plant.id, plant]));
    const today = startOfDay(new Date());
    const slots = new Map<string, Upcoming & { kinds: string[] }>();

    for (const task of tasks) {
      if (!task.enabled || !isTaskKind(task.kind)) continue;

      const plant = byId.get(task.plant_id);
      if (!plant) continue;

      const due = startOfDay(parseDay(task.next_at));
      const late = due.getTime() < today.getTime();
      const at = new Date(late ? today : due);
      const [hour, minute] = (task.remind_at ?? DEFAULT_REMINDER_TIME)
        .slice(0, 5)
        .split(":")
        .map(Number);

      at.setHours(hour, minute, 0, 0);

      const key = `${plant.id}:${at.getTime()}`;
      const slot = slots.get(key) ?? {
        id: key,
        at,
        title: plant.nickname,
        body: "",
        kinds: [],
      };

      slot.kinds.push(
        tPlants(TASK_LABELS[task.kind as keyof typeof TASK_LABELS]),
      );
      slots.set(key, slot);
    }

    return [...slots.values()]
      .map((slot) => ({ ...slot, body: slot.kinds.join(", ") }))
      .sort((a, b) => a.at.getTime() - b.at.getTime())
      .slice(0, HORIZON);
  }, [enabled, tasks, plants, tPlants]);

  const toggle = useCallback(async () => {
    const next = !enabled;

    setEnabled(next);
    setApplying(true);

    try {
      if (!next) {
        updateProfile({ notifications_enabled: false });
        await unregisterPushToken();
        return;
      }

      const granted = await ensureNotificationPermission();

      if (!granted) {
        const status = await Notifications.getPermissionsAsync();
        setBlocked(!status.canAskAgain);
        setEnabled(false);
        return;
      }

      setBlocked(false);
      updateProfile({ notifications_enabled: true });

      if (profile) await registerPushToken(profile.id);
    } finally {
      setApplying(false);
    }
  }, [enabled, profile, updateProfile]);

  return {
    enabled,
    blocked,
    scheduled: upcoming.length,
    upcoming,
    applying,
    saving,
    hasTasks: tasks.length > 0,
    toggle,
    openSettings: () => Linking.openSettings(),
  };
}
