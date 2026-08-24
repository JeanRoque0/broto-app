import { useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { Toast } from "@/components/ui/Toast";
import {
  useCreateGroup,
  useGroups,
  useSetGroupPlants,
} from "@/hooks/useGroups";
import { usePlants } from "@/hooks/usePlants";
import { useAnalysisStore } from "@/store";
import { PlantGroup } from "@/types/plant";

export function usePlantsScreen() {
  const { t } = useTranslation("plants");
  const { t: tCommon } = useTranslation();
  const router = useRouter();
  const { plants, isLoading, isError, refetch, isRefetching } = usePlants();
  const { groups } = useGroups();
  const createGroup = useCreateGroup();
  const setGroupPlants = useSetGroupPlants();
  const resetAnalysis = useAnalysisStore((state) => state.reset);
  const setAnalysisGroup = useAnalysisStore((state) => state.setGroupId);

  const [addVisible, setAddVisible] = useState(false);
  const [groupSheet, setGroupSheet] = useState(false);
  const [pickGroup, setPickGroup] = useState<PlantGroup | null>(null);
  const [addGroupId, setAddGroupId] = useState<string | null>(null);

  const plantsByGroup = useMemo(() => {
    const map = new Map<string, typeof plants>();

    for (const plant of plants) {
      if (!plant.group_id) continue;
      map.set(plant.group_id, [...(map.get(plant.group_id) ?? []), plant]);
    }

    return map;
  }, [plants]);

  async function submitGroup(name: string) {
    try {
      const created = await createGroup.mutateAsync(name);
      setGroupSheet(false);
      setPickGroup(created);
    } catch {
      Toast.show({
        text: tCommon("requestFailed"),
        subtitle: tCommon("requestFailedSubtitle"),
      });
    }
  }

  async function savePickedPlants(plantIds: string[]) {
    if (!pickGroup) return;

    try {
      await setGroupPlants.mutateAsync({ groupId: pickGroup.id, plantIds });
      setPickGroup(null);
      Toast.show({ text: t("groupPlantsSaved") });
    } catch {
      Toast.show({
        text: tCommon("requestFailed"),
        subtitle: tCommon("requestFailedSubtitle"),
      });
    }
  }

  return {
    plants,
    groups,
    plantsByGroup,
    isLoading,
    isError,
    isRefetching,
    refetch,
    openPlant: useCallback(
      (plantId: string) => router.push(`/(app)/plant/${plantId}`),
      [router],
    ),
    openGroup: useCallback(
      (groupId: string) =>
        router.push({ pathname: "/(app)/group/[id]", params: { id: groupId } }),
      [router],
    ),
    pickGroup,
    openPick: useCallback((group: PlantGroup) => setPickGroup(group), []),
    closePick: useCallback(() => setPickGroup(null), []),
    savingPick: setGroupPlants.isPending,
    savePickedPlants,
    addVisible,
    openAdd: useCallback(() => {
      setAddGroupId(null);
      setAddVisible(true);
    }, []),
    closeAdd: useCallback(() => setAddVisible(false), []),
    createInGroup: useCallback(() => {
      setAddGroupId(pickGroup?.id ?? null);
      setPickGroup(null);
      setAddVisible(true);
    }, [pickGroup]),
    groupSheet,
    openGroupSheet: useCallback(() => setGroupSheet(true), []),
    closeGroupSheet: useCallback(() => setGroupSheet(false), []),
    savingGroup: createGroup.isPending,
    submitGroup,
    startAnalysis: useCallback(() => {
      setAddVisible(false);
      resetAnalysis();
      setAnalysisGroup(addGroupId);
      router.push("/(app)/analyze/camera");
    }, [router, resetAnalysis, setAnalysisGroup, addGroupId]),
    addWithoutPhoto: useCallback(() => {
      setAddVisible(false);
      router.push({
        pathname: "/(app)/plant/new",
        params: addGroupId ? { group: addGroupId } : undefined,
      });
    }, [router, addGroupId]),
  };
}
