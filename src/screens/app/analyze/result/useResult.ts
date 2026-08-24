import { useRouter } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { Toast } from "@/components/ui/Toast";
import { useCreateGroup, useGroups } from "@/hooks/useGroups";
import { useCreatePlant } from "@/hooks/usePlants";
import {
  linkIdentificationToPlant,
  submitFeedback,
} from "@/services/supabase/identifications";
import { useAnalysisStore } from "@/store";
import { openSupportEmail } from "@/utils/support";

export function useResult() {
  const { t: tCommon } = useTranslation();
  const router = useRouter();
  const createPlant = useCreatePlant();
  const { groups } = useGroups();
  const createGroup = useCreateGroup();

  const result = useAnalysisStore((state) => state.result);
  const photos = useAnalysisStore((state) => state.photos);
  const photoPaths = useAnalysisStore((state) => state.photoPaths);
  const identificationId = useAnalysisStore((state) => state.identificationId);
  const reset = useAnalysisStore((state) => state.reset);
  const plantId = useAnalysisStore((state) => state.plantId);
  const groupId = useAnalysisStore((state) => state.groupId);
  const fromHistory = useAnalysisStore((state) => state.fromHistory);
  const storedFeedback = useAnalysisStore((state) => state.wasHelpful);
  const setStoredFeedback = useAnalysisStore((state) => state.setWasHelpful);

  const [selectedGroup, setSelectedGroup] = useState<string | null>(groupId);
  const [groupSheet, setGroupSheet] = useState(false);
  const [groupModal, setGroupModal] = useState(false);
  const [feedback, setFeedback] = useState<boolean | null>(storedFeedback);

  async function submitGroup(name: string) {
    try {
      const created = await createGroup.mutateAsync(name);
      setSelectedGroup(created.id);
      setGroupSheet(false);
      setGroupModal(true);
    } catch {
      Toast.show({
        text: tCommon("requestFailed"),
        subtitle: tCommon("requestFailedSubtitle"),
      });
    }
  }

  function sendFeedback(helpful: boolean) {
    setFeedback(helpful);
    setStoredFeedback(helpful);
    if (!identificationId) return;
    submitFeedback(identificationId, helpful).catch(() => undefined);
  }

  function close() {
    if (fromHistory) {
      reset();
      router.back();
      return;
    }

    reset();
    router.replace("/(app)/(tabs)");
  }

  async function persist() {
    if (!result) return;
    setGroupModal(false);

    try {
      const plant = await createPlant.mutateAsync({
        nickname: result.especie?.comum ?? "",
        species_common: result.especie?.comum ?? null,
        species_scientific: result.especie?.cientifico ?? null,
        photo_path: photoPaths[0] ?? null,
        group_id: selectedGroup,
        watering_interval_days: result.cuidados?.rega_dias ?? null,
        light: result.cuidados?.luz ?? null,
        light_note: result.cuidados?.luz_nota || null,
        fertilizer: result.cuidados?.adubo ?? null,
        fertilizer_note: result.cuidados?.adubo_nota || null,
        toxic_to_pets: result.toxica_para_pets,
        mist_days: result.cuidados?.vaporizar_dias ?? null,
        rotate_days: result.cuidados?.girar_dias ?? null,
        repot_months: result.cuidados?.replantar_meses ?? null,
        prune_month: result.cuidados?.podar_mes ?? null,
      });

      if (identificationId) {
        await linkIdentificationToPlant(identificationId, plant.id).catch(
          () => undefined,
        );
      }

      reset();
      router.replace(`/(app)/plant/${plant.id}`);
    } catch {
      Toast.show({
        text: tCommon("requestFailed"),
        subtitle: tCommon("requestFailedSubtitle"),
      });
    }
  }

  function backToPlant() {
    if (!plantId) {
      close();
      return;
    }

    if (fromHistory) {
      router.push(`/(app)/plant/${plantId}`);
      return;
    }

    reset();
    router.replace(`/(app)/plant/${plantId}`);
  }

  return {
    result,
    fromHistory,
    feedback,
    sendFeedback,
    canRate: !!identificationId,
    report: () =>
      openSupportEmail(
        [
          identificationId ? `Analise ${identificationId}` : null,
          result?.especie?.cientifico ?? null,
        ].filter((line): line is string => !!line),
      ),
    groups,
    selectedGroup,
    selectGroup: setSelectedGroup,
    groupSheet,
    openGroupSheet: () => {
      setGroupModal(false);
      setGroupSheet(true);
    },
    closeGroupSheet: () => setGroupSheet(false),
    savingGroup: createGroup.isPending,
    submitGroup,
    plantId,
    backToPlant,
    photo: photos[0],
    photoPath: photoPaths[0] ?? null,
    saving: createPlant.isPending,
    canSave: !!result?.especie,
    save: () => setGroupModal(true),
    confirmSave: persist,
    groupModal,
    closeGroupModal: () => setGroupModal(false),
    close,
  };
}
