import { useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { Toast } from "@/components/ui/Toast";
import { useAuth } from "@/hooks/useAuth";
import { useGroups } from "@/hooks/useGroups";
import { useProfile } from "@/hooks/useProfile";
import { getCredits } from "@/utils/credits";
import {
  plantKeys,
  useCreatePlant,
  usePlant,
  usePlantIdentifications,
  useUpdatePlant,
} from "@/hooks/usePlants";
import { resolvePlantIdentifications } from "@/services/supabase/identifications";
import { logCareEvent } from "@/services/supabase/plants";
import { uploadPhoto } from "@/services/supabase/storage";
import { FertilizerPace, LightLevel } from "@/types/identification";
import { PlantInput } from "@/types/plant";

export const PLANT_FORM_STEPS = [
  "photo",
  "identity",
  "water",
  "light",
  "extras",
] as const;

export type PlantFormStep = (typeof PLANT_FORM_STEPS)[number];

export type PlantFormValues = {
  nickname: string;
  species: string;
  groupId: string | null;
  interval: number;
  light: LightLevel | null;
  fertilizer: FertilizerPace | null;
  toxic: boolean;
  wateredToday: boolean;
};

const DEFAULT_INTERVAL = 7;

export function usePlantForm() {
  const { t } = useTranslation("plants");
  const { t: tCommon } = useTranslation();
  const router = useRouter();
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

  const [stepIndex, setStepIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [saving, setSaving] = useState(false);
  const [photoSheet, setPhotoSheet] = useState(false);
  const [photoWarning, setPhotoWarning] = useState(false);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [photoPath, setPhotoPath] = useState<string | null>(null);
  const [ready, setReady] = useState(!isEditing);

  const {
    control,
    handleSubmit,
    trigger,
    reset,
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
    });

    setPhotoPath(plant.photo_path);
    setReady(true);
  }, [isEditing, plant, ready, reset]);

  const step = PLANT_FORM_STEPS[stepIndex];
  const isLastStep = stepIndex === PLANT_FORM_STEPS.length - 1;
  const nickname = watch("nickname");
  const photoChanged = !!photoUri;
  const hasOpenDiagnosis = (identifications ?? []).some(
    (item) => item.result?.saude !== "saudavel" && !item.resolved_at,
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
          last_watered_at: wateredAt?.toISOString(),
        };

        if (isEditing) {
          await updatePlant.mutateAsync(payload);

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
      plant,
      plantId,
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

  return {
    control,
    errors,
    groups,
    isPro: getCredits(profile ?? null).isPro,
    openPaywall: () => router.push("/(app)/paywall"),
    step,
    stepIndex,
    direction,
    stepCount: PLANT_FORM_STEPS.length,
    isLastStep,
    isEditing,
    saving,
    photoUri,
    photoPath,
    photoSheet,
    photoWarning,
    canAdvance: step !== "identity" || nickname.trim().length > 0,
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
    handleAdvance,
    handleBack,
  };
}
