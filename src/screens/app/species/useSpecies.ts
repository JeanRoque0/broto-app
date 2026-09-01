import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { Share } from "react-native";

import { Toast } from "@/components/ui/Toast";
import { useCreatePlant } from "@/hooks/usePlants";
import { useSpeciesStore } from "@/store/speciesStore";

export function useSpecies() {
  const { t } = useTranslation("search");
  const { t: tCommon } = useTranslation();
  const router = useRouter();
  const createPlant = useCreatePlant();
  const species = useSpeciesStore((state) => state.selected);

  const [photoIndex, setPhotoIndex] = useState<number | null>(null);

  const title = species?.common ?? species?.scientific ?? "";

  const share = useCallback(async () => {
    if (!species) return;

    const lines = [
      species.common
        ? `${species.common} (${species.scientific})`
        : species.scientific,
      species.extract,
      t("shareSignature"),
    ].filter(Boolean);

    try {
      await Share.share({ message: lines.join("\n\n") });
    } catch {
      Toast.show({ text: tCommon("requestFailed") });
    }
  }, [species, t, tCommon]);

  const add = useCallback(async () => {
    if (!species) return;

    try {
      const plant = await createPlant.mutateAsync({
        nickname: species.common ?? species.scientific,
        species_common: species.common,
        species_scientific: species.scientific,
      });

      Toast.show({ text: t("added") });
      router.replace(`/(app)/plant/${plant.id}`);
    } catch {
      Toast.show({
        text: tCommon("requestFailed"),
        subtitle: tCommon("requestFailedSubtitle"),
      });
    }
  }, [species, createPlant, router, t, tCommon]);

  return {
    species,
    title,
    adding: createPlant.isPending,
    add,
    share,
    photoIndex,
    openPhoto: (index: number) => setPhotoIndex(index),
    closePhoto: () => setPhotoIndex(null),
  };
}
