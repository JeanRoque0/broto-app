import { useQuery } from "@tanstack/react-query";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Keyboard } from "react-native";
import { useTranslation } from "react-i18next";

import { useModalAutoFocus } from "@/hooks/useModalAutoFocus";
import { useSearchHistory } from "@/hooks/useSearchHistory";
import { Toast } from "@/components/ui/Toast";
import { useCreatePlant } from "@/hooks/usePlants";
import { Species, searchSpecies } from "@/services/api/search";

const DEBOUNCE = 500;
const MIN_LENGTH = 3;

export function useSearch() {
  const { t } = useTranslation("search");
  const { t: tCommon } = useTranslation();
  const router = useRouter();
  const createPlant = useCreatePlant();
  const history = useSearchHistory();
  const { ref: inputRef, onShow, cancelAutoFocus } = useModalAutoFocus();
  const dismissed = useRef("");

  const [term, setTerm] = useState("");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Species | null>(null);
  const [photoIndex, setPhotoIndex] = useState<number | null>(null);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setQuery(term), DEBOUNCE);
    return () => clearTimeout(timer);
  }, [term]);

  const results = useQuery({
    queryKey: ["species", query],
    queryFn: () => searchSpecies(query),
    enabled: query.trim().length >= MIN_LENGTH,
  });

  useEffect(() => {
    if (!results.isSuccess || (results.data?.length ?? 0) === 0) return;

    history.remember(query);

    if (dismissed.current !== query) {
      dismissed.current = query;
      Keyboard.dismiss();
    }
  }, [results.isSuccess, results.data, query]);

  useFocusEffect(
    useCallback(() => {
      onShow();
      return cancelAutoFocus;
    }, [onShow, cancelAutoFocus]),
  );

  async function add(species: Species) {
    try {
      const plant = await createPlant.mutateAsync({
        nickname: species.common ?? species.scientific,
        species_common: species.common,
        species_scientific: species.scientific,
      });

      setSelected(null);
      Toast.show({ text: t("added") });
      router.push(`/(app)/plant/${plant.id}`);
    } catch {
      Toast.show({
        text: tCommon("requestFailed"),
        subtitle: tCommon("requestFailedSubtitle"),
      });
    }
  }

  return {
    term,
    setTerm,
    inputRef,
    history: history.items,
    forgetTerm: history.forget,
    showHistory:
      focused && term.trim().length === 0 && history.items.length > 0,
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false),
    results: results.data ?? [],
    isLoading: results.isFetching,
    isError: results.isError,
    hasQuery: query.trim().length >= MIN_LENGTH,
    selected,
    open: (species: Species) => setSelected(species),
    close: () => setSelected(null),
    photoIndex,
    openPhoto: (index: number) => setPhotoIndex(index),
    closePhoto: () => setPhotoIndex(null),
    adding: createPlant.isPending,
    add,
  };
}
