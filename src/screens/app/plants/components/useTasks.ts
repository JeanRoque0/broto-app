import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { Toast } from "@/components/ui/Toast";
import { toDateString } from "@/services/supabase/plantTasks";
import { usePlantTasks, useUpdatePlantTask } from "@/hooks/usePlantTasks";
import { usePlants, useLogTask, useUserCareEvents } from "@/hooks/usePlants";
import { useProfile } from "@/hooks/useProfile";
import { getCredits } from "@/utils/credits";
import {
  FREE_TASK_KINDS,
  TASK_KINDS,
  Task,
  TaskKind,
  buildTasks,
  dayRange,
  isTaskKind,
  parseDay,
  startOfDay,
} from "@/utils/tasks";

const PAST_DAYS = 30;
const FUTURE_DAYS = 365;

export function useTasks() {
  const { t } = useTranslation("plants");
  const router = useRouter();
  const { plants } = usePlants();
  const { data: events } = useUserCareEvents();
  const { tasks: plantTasks } = usePlantTasks();
  const { data: profile } = useProfile();
  const logTask = useLogTask();
  const updateTask = useUpdatePlantTask();

  const [selected, setSelected] = useState(() => startOfDay(new Date()));
  const [pending, setPending] = useState<string | null>(null);
  const [editing, setEditing] = useState<Task | null>(null);

  const isPro = getCredits(profile ?? null).isPro;
  const kinds = isPro ? TASK_KINDS : FREE_TASK_KINDS;

  const days = useMemo(
    () => dayRange(startOfDay(new Date()), PAST_DAYS, FUTURE_DAYS),
    [],
  );

  const nextDay = useMemo(() => {
    const plantIds = new Set(plants.map((plant) => plant.id));

    const upcoming = plantTasks
      .filter(
        (task) =>
          task.enabled &&
          isTaskKind(task.kind) &&
          kinds.includes(task.kind) &&
          plantIds.has(task.plant_id),
      )
      .map((task) => parseDay(task.next_at))
      .filter((day) => day.getTime() > startOfDay(selected).getTime())
      .sort((a, b) => a.getTime() - b.getTime());

    return upcoming[0] ?? null;
  }, [plantTasks, plants, kinds, selected]);

  const tasks = useMemo(
    () =>
      buildTasks({
        plants,
        tasks: plantTasks,
        events: events ?? [],
        day: selected,
        kinds,
      }),
    [plants, plantTasks, events, selected, kinds],
  );

  async function complete(plantId: string, kind: TaskKind) {
    if (pending) return;
    setPending(`${plantId}:${kind}`);

    try {
      await logTask.mutateAsync({ plantId, kind });
    } catch {
      Toast.show({ text: t("taskFailed") });
    } finally {
      setPending(null);
    }
  }

  async function saveTask(payload: {
    interval_days: number;
    next_at: Date;
    enabled?: boolean;
  }) {
    if (!editing) return;

    try {
      await updateTask.mutateAsync({
        taskId: editing.task.id,
        payload: {
          interval_days: payload.interval_days,
          next_at: toDateString(payload.next_at),
          ...(payload.enabled === undefined ? {} : { enabled: payload.enabled }),
        },
      });
      setEditing(null);
      Toast.show({ text: t("taskSaved") });
    } catch {
      Toast.show({ text: t("taskFailed") });
    }
  }

  async function toggleTask(enabled: boolean) {
    if (!editing) return;

    try {
      await updateTask.mutateAsync({
        taskId: editing.task.id,
        payload: { enabled },
      });
      setEditing(null);
      Toast.show({ text: t(enabled ? "taskSaved" : "taskRemoved") });
    } catch {
      Toast.show({ text: t("taskFailed") });
    }
  }

  return {
    days,
    initialIndex: PAST_DAYS,
    selected,
    select: (day: Date) => setSelected(startOfDay(day)),
    tasks,
    nextDay,
    hasPlants: plants.length > 0,
    isPro,
    pending,
    complete,
    editing,
    edit: (task: Task) => setEditing(task),
    closeEdit: () => setEditing(null),
    savingTask: updateTask.isPending,
    saveTask,
    toggleTask,
    openPaywall: () => router.push("/(app)/paywall"),
  };
}
