import { useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { BackHandler } from "react-native";

import { Toast } from "@/components/ui/Toast";
import { useAuth } from "@/hooks/useAuth";
import { useCreateGroup, useGroups } from "@/hooks/useGroups";
import { taskKeys, usePlantTasks, useUpdatePlantTask } from "@/hooks/usePlantTasks";
import { useProfile } from "@/hooks/useProfile";
import { useSpeciesFacts } from "@/hooks/useSpeciesFacts";
import { useTemperatureUnit } from "@/hooks/useTemperatureUnit";
import { getCredits } from "@/utils/credits";
import { FREE_TASK_KINDS, TASK_KINDS } from "@/utils/tasks";
import {
  plantKeys,
  useCreatePlant,
  usePlant,
  usePlantIdentifications,
  useUpdatePlant,
} from "@/hooks/usePlants";
import { resolvePlantIdentifications } from "@/services/supabase/identifications";
import {
  listPlantTasks,
  toDateString,
  updatePlantTask,
} from "@/services/supabase/plantTasks";
import { logCareEvent } from "@/services/supabase/plants";
import { uploadPhoto } from "@/services/supabase/storage";
import { FertilizerPace, LightLevel } from "@/types/identification";
import { PlantInput, PlantTask } from "@/types/plant";
import { previewCareTasks } from "@/utils/carePreview";

export const PLANT_FORM_STEPS = [
  "photo",
  "identity",
  "care",
  "routine",
] as const;

export type PlantFormValues = {
  nickname: string;
  species: string;
  groupId: string | null;
  interval: number;
  light: LightLevel | null;
  fertilizer: FertilizerPace | null;
  toxic: boolean;
  wateredToday: boolean;
  tempMin: number;
  tempMax: number;
};

type TaskDraft = Pick<
  PlantTask,
  "interval_days" | "next_at" | "remind_at" | "enabled"
>;

const DEFAULT_INTERVAL = 7;
const DEFAULT_TEMP_MIN_C = 15;
const DEFAULT_TEMP_MAX_C = 30;

const FERTILIZER_DAYS: Record<string, number> = {
  quinzenal: 15,
  mensal: 30,
  bimestral: 60,
  estacional: 30,
};

export function usePlantForm() {
  const { t } = useTranslation("plants");
  const { t: tCommon } = useTranslation();
  const router = useRouter();
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const { userId } = useAuth();
  const { id, group } = useLocalSearchParams<{
    id?: string;
    group?: string;
  }>();
  const plantId = id ?? "";
  const isEditing = !!plantId;

  const { data: plant } = usePlant(plantId);
  const { groups } = useGroups();
  const { data: profile } = useProfile();
  const { data: identifications } = usePlantIdentifications(plantId);
  const createPlant = useCreatePlant();
  const updatePlant = useUpdatePlant(plantId);
  const createGroup = useCreateGroup();
  const { tasks: allTasks } = usePlantTasks();
  const { facts } = useSpeciesFacts(plant?.species_scientific);
  const { unit } = useTemperatureUnit();
  const updateTask = useUpdatePlantTask();

  const [stepIndex, setStepIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [saving, setSaving] = useState(false);
  const [photoSheet, setPhotoSheet] = useState(false);
  const [photoWarning, setPhotoWarning] = useState(false);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [photoPath, setPhotoPath] = useState<string | null>(null);
  const [ready, setReady] = useState(!isEditing);
  const [groupSheet, setGroupSheet] = useState(false);
  const [editingTask, setEditingTask] = useState<PlantTask | null>(null);
  const [drafts, setDrafts] = useState<Record<string, TaskDraft>>({});
  const [touched, setTouched] = useState<string[]>([]);

  const {
    control,
    handleSubmit,
    trigger,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PlantFormValues>({
    defaultValues: {
      nickname: "",
      species: "",
      groupId: group ?? null,
      interval: DEFAULT_INTERVAL,
      light: null,
      fertilizer: null,
      toxic: false,
      wateredToday: false,
      tempMin: DEFAULT_TEMP_MIN_C,
      tempMax: DEFAULT_TEMP_MAX_C,
    },
    mode: "onTouched",
  });

  useEffect(() => {
    if (!isEditing || !plant || ready) return;

    reset({
      nickname: plant.nickname,
      species: plant.species_scientific ?? plant.species_common ?? "",
      groupId: plant.group_id,
      interval: plant.watering_interval_days ?? DEFAULT_INTERVAL,
      light: (plant.light as LightLevel | null) ?? null,
      fertilizer: (plant.fertilizer as FertilizerPace | null) ?? null,
      toxic: plant.toxic_to_pets ?? false,
      wateredToday: false,
      tempMin:
        plant.temp_min_c ?? facts?.temperatura?.min_c ?? DEFAULT_TEMP_MIN_C,
      tempMax:
        plant.temp_max_c ?? facts?.temperatura?.max_c ?? DEFAULT_TEMP_MAX_C,
    });

    setPhotoPath(plant.photo_path);
    setReady(true);
  }, [isEditing, plant, ready, reset]);

  const step = PLANT_FORM_STEPS[stepIndex];
  const isLastStep = stepIndex === PLANT_FORM_STEPS.length - 1;
  const nickname = watch("nickname");
  const interval = watch("interval");
  const fertilizer = watch("fertilizer");
  const photoChanged = !!photoUri;
  const isPro = getCredits(profile ?? null).isPro;
  const lockedKinds = isPro
    ? []
    : TASK_KINDS.filter((kind) => !FREE_TASK_KINDS.includes(kind));
  const hasOpenDiagnosis = (identifications ?? []).some(
    (item) => item.result?.saude !== "saudavel" && !item.resolved_at,
  );

  const fromCareStep = useCallback(
    (task: PlantTask): PlantTask => {
      if (touched.includes(task.kind)) return task;

      if (task.kind === "water") {
        return { ...task, interval_days: interval };
      }

      if (task.kind === "fertilize") {
        const days = fertilizer ? FERTILIZER_DAYS[fertilizer] : undefined;
        return {
          ...task,
          interval_days: days ?? task.interval_days,
          enabled: days !== undefined,
        };
      }

      return task;
    },
    [touched, interval, fertilizer],
  );

  const plantTasks = allTasks.filter((task) => task.plant_id === plantId);

  const routineTasks = isEditing
    ? plantTasks.map(fromCareStep)
    : previewCareTasks({ rega_dias: interval, adubo: fertilizer }).map((task) =>
        drafts[task.kind] ? { ...task, ...drafts[task.kind] } : task,
      );

  const persist = useCallback(
    async (values: PlantFormValues) => {
      if (!userId) return;
      setSaving(true);

      try {
        const uploadedPath = photoUri
          ? await uploadPhoto({ userId, uri: photoUri, folder: "plants" })
          : null;

        const wateredAt = !isEditing && values.wateredToday ? new Date() : null;

        const payload: PlantInput = {
          nickname: values.nickname.trim(),
          species_scientific: values.species.trim() || null,
          species_common: values.species.trim() || null,
          group_id: values.groupId,
          photo_path: uploadedPath ?? photoPath,
          watering_interval_days: values.interval,
          light: values.light,
          fertilizer: values.fertilizer,
          toxic_to_pets: values.toxic,
          temp_min_c: values.tempMin,
          temp_max_c: values.tempMax,
          last_watered_at: wateredAt?.toISOString(),
        };

        if (isEditing) {
          await updatePlant.mutateAsync(payload);

          const drifted = plantTasks
            .map((row) => ({ row, next: fromCareStep(row) }))
            .filter(
              ({ row, next }) =>
                next.interval_days !== row.interval_days ||
                next.enabled !== row.enabled,
            );

          if (drifted.length > 0) {
            await Promise.all(
              drifted.map(({ row, next }) =>
                updatePlantTask(row.id, {
                  interval_days: next.interval_days,
                  enabled: next.enabled,
                }),
              ),
            ).catch(() => undefined);

            queryClient.invalidateQueries({ queryKey: taskKeys.list(userId) });
          }

          if (uploadedPath) {
            await resolvePlantIdentifications(plantId).catch(() => undefined);
            queryClient.invalidateQueries({
              queryKey: plantKeys.identifications(plantId),
            });
          }

          Toast.show({ text: t("savedChanges") });
          router.back();
          return;
        }

        const created = await createPlant.mutateAsync(payload);

        if (wateredAt) {
          await logCareEvent({
            plantId: created.id,
            userId,
            kind: "water",
            happenedAt: wateredAt,
          }).catch(() => undefined);
        }

        const touched = Object.entries(drafts);

        if (touched.length > 0) {
          const rows = (await listPlantTasks(userId)).filter(
            (row) => row.plant_id === created.id,
          );

          await Promise.all(
            touched.map(([kind, draft]) => {
              const row = rows.find((item) => item.kind === kind);
              return row ? updatePlantTask(row.id, draft) : undefined;
            }),
          ).catch(() => undefined);

          queryClient.invalidateQueries({ queryKey: taskKeys.list(userId) });
        }

        Toast.show({ text: t("created") });
        router.replace(`/(app)/plant/${created.id}`);
      } catch {
        Toast.show({
          text: tCommon("requestFailed"),
          subtitle: tCommon("requestFailedSubtitle"),
        });
      } finally {
        setSaving(false);
      }
    },
    [
      userId,
      photoUri,
      photoPath,
      isEditing,
      plantId,
      drafts,
      plantTasks,
      fromCareStep,
      updatePlant,
      createPlant,
      queryClient,
      router,
      t,
      tCommon,
    ],
  );

  const submit = useCallback(() => {
    if (isEditing && photoChanged && hasOpenDiagnosis) {
      setPhotoWarning(true);
      return;
    }
    handleSubmit(persist)();
  }, [isEditing, photoChanged, hasOpenDiagnosis, handleSubmit, persist]);

  const handleAdvance = useCallback(async () => {
    if (step === "identity") {
      const valid = await trigger("nickname");
      if (!valid) return;
    }

    if (isLastStep) {
      submit();
      return;
    }

    setDirection(1);
    setStepIndex((index) => index + 1);
  }, [step, trigger, isLastStep, submit]);

  const handleBack = useCallback(() => {
    if (stepIndex > 0) {
      setDirection(-1);
      setStepIndex((index) => index - 1);
      return;
    }
    router.back();
  }, [stepIndex, router]);

  useEffect(() => {
    if (stepIndex === 0) return;

    const listener = BackHandler.addEventListener("hardwareBackPress", () => {
      handleBack();
      return true;
    });

    return () => listener.remove();
  }, [stepIndex, handleBack]);

  useEffect(() => {
    navigation.setOptions({ gestureEnabled: stepIndex === 0 });
  }, [navigation, stepIndex]);

  async function submitGroup(name: string) {
    try {
      const created = await createGroup.mutateAsync(name);
      setValue("groupId", created.id);
      setGroupSheet(false);
    } catch {
      Toast.show({ text: tCommon("requestFailed") });
    }
  }

  function draftTask(patch: TaskDraft) {
    if (!editingTask) return;
    setDrafts((current) => ({ ...current, [editingTask.kind]: patch }));
    setEditingTask(null);
  }

  async function saveTask(payload: {
    interval_days: number;
    next_at: Date;
    remind_at: string;
    enabled?: boolean;
  }) {
    if (!editingTask) return;

    const patch = {
      interval_days: payload.interval_days,
      next_at: toDateString(payload.next_at),
      remind_at: payload.remind_at,
      ...(payload.enabled === undefined ? {} : { enabled: payload.enabled }),
    };

    if (!isEditing) {
      draftTask({ enabled: editingTask.enabled, ...patch });
      return;
    }

    try {
      await updateTask.mutateAsync({ taskId: editingTask.id, payload: patch });
      setTouched((current) =>
        current.includes(editingTask.kind)
          ? current
          : [...current, editingTask.kind],
      );
      setEditingTask(null);
      Toast.show({ text: t("taskSaved") });
    } catch {
      Toast.show({ text: t("taskFailed") });
    }
  }

  async function toggleTask(enabled: boolean) {
    if (!editingTask) return;

    if (!isEditing) {
      draftTask({
        interval_days: editingTask.interval_days,
        next_at: editingTask.next_at,
        remind_at: editingTask.remind_at,
        enabled,
      });
      return;
    }

    try {
      await updateTask.mutateAsync({
        taskId: editingTask.id,
        payload: { enabled },
      });
      setTouched((current) =>
        current.includes(editingTask.kind)
          ? current
          : [...current, editingTask.kind],
      );
      setEditingTask(null);
      Toast.show({ text: t(enabled ? "taskSaved" : "taskRemoved") });
    } catch {
      Toast.show({ text: t("taskFailed") });
    }
  }

  return {
    control,
    errors,
    groups,
    isPro,
    isEditing,
    unit,
    saving,
    step,
    stepIndex,
    direction,
    stepCount: PLANT_FORM_STEPS.length,
    isLastStep,
    canAdvance: step !== "identity" || nickname.trim().length > 0,
    openPaywall: () => router.push("/(app)/paywall"),
    handleAdvance,
    handleBack,

    photoUri,
    photoPath,
    photoSheet,
    photoWarning,
    openPhotoSheet: () => setPhotoSheet(true),
    closePhotoSheet: () => setPhotoSheet(false),
    pickPhoto: (uri: string) => setPhotoUri(uri),
    clearPhoto: () => {
      setPhotoUri(null);
      setPhotoPath(null);
    },
    confirmPhotoChange: () => {
      setPhotoWarning(false);
      handleSubmit(persist)();
    },
    cancelPhotoChange: () => setPhotoWarning(false),

    groupSheet,
    openGroupSheet: () => setGroupSheet(true),
    closeGroupSheet: () => setGroupSheet(false),
    savingGroup: createGroup.isPending,
    submitGroup,

    routineTasks,
    untouch: (kind: string) =>
      setTouched((current) => current.filter((item) => item !== kind)),
    lockedKinds,
    editingTask,
    plantName: isEditing ? (plant?.nickname ?? "") : nickname,
    editTask: (task: PlantTask) => setEditingTask(task),
    closeTaskEdit: () => setEditingTask(null),
    savingTask: updateTask.isPending,
    saveTask,
    toggleTask,
  };
}
