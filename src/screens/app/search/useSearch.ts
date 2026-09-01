import { useQuery } from "@tanstack/react-query";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Keyboard } from "react-native";

import { useModalAutoFocus } from "@/hooks/useModalAutoFocus";
import { useSearchHistory } from "@/hooks/useSearchHistory";
import { Species, searchSpecies } from "@/services/api/search";
import { useSpeciesStore } from "@/store/speciesStore";

const DEBOUNCE = 500;
const MIN_LENGTH = 3;

export function useSearch() {
  const router = useRouter();
  const history = useSearchHistory();
  const selectSpecies = useSpeciesStore((state) => state.select);
  const { ref: inputRef, onShow, cancelAutoFocus } = useModalAutoFocus();
  const dismissed = useRef("");
  const returning = useRef(false);

  const [term, setTerm] = useState("");
  const [query, setQuery] = useState("");
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
      if (returning.current) {
        returning.current = false;
        return;
      }

      onShow();
      return cancelAutoFocus;
    }, [onShow, cancelAutoFocus]),
  );

  function open(species: Species) {
    returning.current = true;
    selectSpecies(species);
    router.push("/(app)/species");
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
    open,
  };
}
