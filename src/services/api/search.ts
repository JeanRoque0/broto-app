import { supabase } from "@/services/supabase/client";

import { api } from "./config";

export interface Species {
  scientific: string;
  common: string | null;
  extract: string | null;
  images: string[];
}

function normalize(term: string) {
  return term
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9 ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export async function searchSpecies(term: string): Promise<Species[]> {
  const key = normalize(term);
  if (key.length < 3) return [];

  const { data: cached } = await supabase
    .from("species_cache")
    .select("results")
    .eq("term", key)
    .maybeSingle<{ results: Species[] }>();

  if (cached) return cached.results;

  const response = await api.post<{ resultados: Species[] }>("/search", {
    term: key,
  });

  return response.data.resultados;
}
