import * as Clipboard from "expo-clipboard";
import { useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { LayoutChangeEvent } from "react-native";

import { Toast } from "@/components/ui/Toast";
import { useCreatePlant } from "@/hooks/usePlants";
import { useShareCard } from "@/hooks/useShareCard";
import { useSpeciesStore } from "@/store/speciesStore";

function fileName(url: string) {
  const last = url.split("/").pop() ?? url;
  return last.replace(/^\d+px-/, "").toLowerCase();
}

export function useSpecies() {
  const { t } = useTranslation("search");
  const { t: tCommon } = useTranslation();
  const router = useRouter();
  const createPlant = useCreatePlant();
  const species = useSpeciesStore((state) => state.selected);
  const { shot, share, sharing } = useShareCard();

  const [photoIndex, setPhotoIndex] = useState<number | null>(null);
  const [footerHeight, setFooterHeight] = useState(0);

  const title = species?.common ?? species?.scientific ?? "";

  const images = useMemo(() => {
    const seen = new Set<string>();

    return (species?.images ?? []).filter((image) => {
      const key = fileName(image);
      if (seen.has(key)) return false;

      seen.add(key);
      return true;
    });
  }, [species?.images]);

  const copy = useCallback(async () => {
    if (!species) return;

    const lines = [
      species.common && `${t("copyCommon")}: ${species.common}`,
      `${t("copyScientific")}: ${species.scientific}`,
      species.extract,
    ].filter(Boolean);

    await Clipboard.setStringAsync(lines.join("\n"));
    Toast.show({ text: t("copied") });
  }, [species, t]);

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
    images,
    adding: createPlant.isPending,
    add,
    copy,
    shot,
    share,
    sharing,
    footerHeight,
    onFooterLayout: (event: LayoutChangeEvent) =>
      setFooterHeight(event.nativeEvent.layout.height),
    photoIndex,
    openPhoto: (index: number) => setPhotoIndex(index),
    closePhoto: () => setPhotoIndex(null),
  };
}
