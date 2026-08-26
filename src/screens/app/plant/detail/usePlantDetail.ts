import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { Toast } from "@/components/ui/Toast";
import { useAnalysisStore } from "@/store";
import { toDateString } from "@/services/supabase/plantTasks";
import { usePlantTasks, useUpdatePlantTask } from "@/hooks/usePlantTasks";
import { PlantTask } from "@/types/plant";
import { useProfile } from "@/hooks/useProfile";
import { getCredits } from "@/utils/credits";
import {
  FREE_TASK_KINDS,
  TASK_KINDS,
  buildTasks,
  isTaskKind,
  parseDay,
} from "@/utils/tasks";
import { CareEventKind } from "@/types/plant";
import {
  useArchivePlant,
  useCareEvents,
  useLogCare,
  usePlant,
  usePlantIdentifications,
  useResolveIdentification,
} from "@/hooks/usePlants";

export function usePlantDetail() {
  const { t } = useTranslation("plants");
  const { t: tCommon } = useTranslation();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const plantId = id ?? "";

  const { data: plant, isLoading, isError, refetch } = usePlant(plantId);
  const { data: events } = useCareEvents(plantId);
  const { data: identifications } = usePlantIdentifications(plantId);
  const resolveMutation = useResolveIdentification(plantId);
  const resetAnalysis = useAnalysisStore((state) => state.reset);
  const setAnalysisPlant = useAnalysisStore((state) => state.setPlantId);
  const logCare = useLogCare(plantId);
  const archivePlant = useArchivePlant();

  const [removeVisible, setRemoveVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<PlantTask | null>(null);

  const { tasks: allTasks } = usePlantTasks();
  const updateTask = useUpdatePlantTask();

  const careTasks = allTasks.filter((task) => task.plant_id === plantId);
  const { data: profile } = useProfile();
  const isPro = getCredits(profile ?? null).isPro;
  const kinds = isPro ? TASK_KINDS : FREE_TASK_KINDS;
  const lockedKinds = isPro
    ? []
    : TASK_KINDS.filter((kind) => !FREE_TASK_KINDS.includes(kind));

  const todayTasks = plant
    ? buildTasks({
        plants: [plant],
        tasks: careTasks,
        events: events ?? [],
        day: new Date(),
        kinds,
      }).filter((task) => !task.done)
    : [];

  const upcoming =
    careTasks
      .filter((task) => task.enabled && isTaskKind(task.kind))
      .sort(
        (a, b) => parseDay(a.next_at).getTime() - parseDay(b.next_at).getTime(),
      )[0] ?? null;

  async function complete(kind: string) {
    try {
      await logCare.mutateAsync({ kind: kind as CareEventKind });
      Toast.show({ text: t("taskDone") });
    } catch {
      Toast.show({
        text: tCommon("requestFailed"),
        subtitle: tCommon("requestFailedSubtitle"),
      });
    }
  }

  async function saveTask(payload: {
    interval_days: number;
    next_at: Date;
    remind_at: string;
    enabled?: boolean;
  }) {
    if (!editingTask) return;

    try {
      await updateTask.mutateAsync({
        taskId: editingTask.id,
        payload: {
          interval_days: payload.interval_days,
          next_at: toDateString(payload.next_at),
          remind_at: payload.remind_at,
          ...(payload.enabled === undefined ? {} : { enabled: payload.enabled }),
        },
      });
      setEditingTask(null);
      Toast.show({ text: t("taskSaved") });
    } catch {
      Toast.show({ text: t("taskFailed") });
    }
  }

  async function toggleTask(enabled: boolean) {
    if (!editingTask) return;

    try {
      await updateTask.mutateAsync({
        taskId: editingTask.id,
        payload: { enabled },
      });
      setEditingTask(null);
      Toast.show({ text: t(enabled ? "taskSaved" : "taskRemoved") });
    } catch {
      Toast.show({ text: t("taskFailed") });
    }
  }

  async function remove() {
    try {
      await archivePlant.mutateAsync(plantId);
      setRemoveVisible(false);
      router.replace("/(app)/(tabs)");
      Toast.show({ text: t("removed") });
    } catch {
      Toast.show({
        text: tCommon("requestFailed"),
        subtitle: tCommon("requestFailedSubtitle"),
      });
    }
  }

  return {
    plant,
    isPro,
    lockedKinds,
    openPaywall: () => router.push("/(app)/paywall"),
    events: events ?? [],
    careTasks,
    todayTasks,
    upcoming,
    complete,
    pendingTask: logCare.isPending ? (logCare.variables?.kind ?? null) : null,
    editingTask,
    editTask: (task: PlantTask) => setEditingTask(task),
    closeTaskEdit: () => setEditingTask(null),
    savingTask: updateTask.isPending,
    saveTask,
    toggleTask,
    diagnoses: (identifications ?? []).filter(
      (item) => item.result?.saude !== "saudavel",
    ),
    resolve: (id: string) => resolveMutation.mutate({ id, resolved: true }),
    resolving: resolveMutation.isPending,
    startNewAnalysis: () => {
      resetAnalysis();
      setAnalysisPlant(plantId);
      router.push("/(app)/analyze/camera");
    },
    isLoading,
    isError,
    refetch,
    removing: archivePlant.isPending,
    removeVisible,
    menuVisible,
    openMenu: () => setMenuVisible(true),
    closeMenu: () => setMenuVisible(false),
    openRemove: () => setRemoveVisible(true),
    closeRemove: () => setRemoveVisible(false),
    remove,
    edit: () => router.push(`/(app)/plant/${plantId}/edit`),
    goBack: () => router.back(),
  };
}
