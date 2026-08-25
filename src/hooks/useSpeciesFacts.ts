import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import { getSpeciesFacts } from "@/services/supabase/speciesFacts";

export const speciesFactKeys = {
  one: (scientific: string, language: string) =>
    ["species-facts", scientific, language] as const,
};

export function useSpeciesFacts(scientific: string | null | undefined) {
  const { i18n } = useTranslation();
  const language = i18n.language;

  const query = useQuery({
    queryKey: speciesFactKeys.one(scientific ?? "", language),
    queryFn: () => getSpeciesFacts(scientific!, language),
    enabled: !!scientific,
    staleTime: Infinity,
  });

  return { ...query, facts: query.data ?? null };
}
