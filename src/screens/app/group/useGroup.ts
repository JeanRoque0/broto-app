import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { Toast } from "@/components/ui/Toast";
import {
  useDeleteGroup,
  useGroups,
  useRenameGroup,
  useSetGroupPlants,
} from "@/hooks/useGroups";
import { usePlants } from "@/hooks/usePlants";
import { useAnalysisStore } from "@/store";

export function useGroup() {
  const { t } = useTranslation("plants");
  const { t: tCommon } = useTranslation();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const groupId = id ?? "";

  const { groups, isLoading } = useGroups();
  const { plants } = usePlants();
  const renameGroup = useRenameGroup();
  const deleteGroup = useDeleteGroup();
  const setGroupPlants = useSetGroupPlants();
  const resetAnalysis = useAnalysisStore((state) => state.reset);
  const setAnalysisGroup = useAnalysisStore((state) => state.setGroupId);

  const [renameVisible, setRenameVisible] = useState(false);
  const [removeVisible, setRemoveVisible] = useState(false);
  const [pickVisible, setPickVisible] = useState(false);
  const [addVisible, setAddVisible] = useState(false);

  const group = groups.find((item) => item.id === groupId) ?? null;

  const groupPlants = useMemo(
    () => plants.filter((plant) => plant.group_id === groupId),
    [plants, groupId],
  );

  async function rename(name: string) {
    try {
      await renameGroup.mutateAsync({ groupId, name });
      setRenameVisible(false);
      Toast.show({ text: t("groupRenamed") });
    } catch {
      Toast.show({
        text: tCommon("requestFailed"),
        subtitle: tCommon("requestFailedSubtitle"),
      });
    }
  }

  async function savePlants(plantIds: string[]) {
    try {
      await setGroupPlants.mutateAsync({ groupId, plantIds });
      setPickVisible(false);
      Toast.show({ text: t("groupPlantsSaved") });
    } catch {
      Toast.show({
        text: tCommon("requestFailed"),
        subtitle: tCommon("requestFailedSubtitle"),
      });
    }
  }

  async function remove() {
    try {
      await deleteGroup.mutateAsync(groupId);
      setRemoveVisible(false);
      router.back();
      Toast.show({ text: t("groupDeleted") });
    } catch {
      Toast.show({
        text: tCommon("requestFailed"),
        subtitle: tCommon("requestFailedSubtitle"),
      });
    }
  }

  return {
    group,
    plants: groupPlants,
    allPlants: plants,
    isLoading,
    renameVisible,
    removeVisible,
    pickVisible,
    renaming: renameGroup.isPending,
    removing: deleteGroup.isPending,
    saving: setGroupPlants.isPending,
    openRename: () => setRenameVisible(true),
    closeRename: () => setRenameVisible(false),
    openRemove: () => setRemoveVisible(true),
    closeRemove: () => setRemoveVisible(false),
    openPick: () => setPickVisible(true),
    closePick: () => setPickVisible(false),
    addVisible,
    closeAdd: () => setAddVisible(false),
    createNew: () => {
      setPickVisible(false);
      setAddVisible(true);
    },
    startAnalysis: () => {
      setAddVisible(false);
      resetAnalysis();
      setAnalysisGroup(groupId);
      router.push("/(app)/analyze/camera");
    },
    addWithoutPhoto: () => {
      setAddVisible(false);
      router.push({
        pathname: "/(app)/plant/new",
        params: { group: groupId },
      });
    },
    rename,
    remove,
    savePlants,
    openPlant: (plantId: string) => router.push(`/(app)/plant/${plantId}`),
  };
}
