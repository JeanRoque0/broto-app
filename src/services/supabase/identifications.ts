import { supabase } from "@/services/supabase/client";
import { Identification } from "@/types/identification";

export async function listIdentifications(userId: string, limit = 50) {
  const { data, error } = await supabase
    .from("identifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit)
    .returns<Identification[]>();

  if (error) throw error;
  return data;
}

export async function listPlantIdentifications(plantId: string, limit = 20) {
  const { data, error } = await supabase
    .from("identifications")
    .select("*")
    .eq("plant_id", plantId)
    .order("created_at", { ascending: false })
    .limit(limit)
    .returns<Identification[]>();

  if (error) throw error;
  return data;
}

export async function linkIdentificationToPlant(
  identificationId: string,
  plantId: string,
) {
  const { error } = await supabase
    .from("identifications")
    .update({ plant_id: plantId })
    .eq("id", identificationId);

  if (error) throw error;
}

export async function resolveIdentification(
  identificationId: string,
  resolved: boolean,
) {
  const { error } = await supabase
    .from("identifications")
    .update({ resolved_at: resolved ? new Date().toISOString() : null })
    .eq("id", identificationId);

  if (error) throw error;
}

export async function resolvePlantIdentifications(plantId: string) {
  const { error } = await supabase
    .from("identifications")
    .update({ resolved_at: new Date().toISOString() })
    .eq("plant_id", plantId)
    .is("resolved_at", null);

  if (error) throw error;
}

export async function submitFeedback(
  identificationId: string,
  wasHelpful: boolean,
) {
  const { error } = await supabase
    .from("identifications")
    .update({ was_helpful: wasHelpful })
    .eq("id", identificationId);

  if (error) throw error;
}
