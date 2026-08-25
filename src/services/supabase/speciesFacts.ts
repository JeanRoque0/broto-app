import { supabase } from "@/services/supabase/client";
import { Care, Temperature } from "@/types/identification";

export interface SpeciesFacts {
  cuidados: Care | null;
  toxica_para_pets: boolean | null;
  temperatura: Temperature | null;
  cultivo: string | null;
  simbolismo: string | null;
}

export async function getSpeciesFacts(scientific: string, language: string) {
  const { data, error } = await supabase
    .from("species_facts")
    .select("data")
    .eq("scientific", scientific)
    .eq("language", language)
    .maybeSingle();

  if (error) throw error;

  return (data?.data ?? null) as SpeciesFacts | null;
}
