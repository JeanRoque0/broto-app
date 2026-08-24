import { supabase } from "@/services/supabase/client";
import { advancePlantTask } from "@/services/supabase/plantTasks";
import { CareEvent, CareEventKind, Plant, PlantInput } from "@/types/plant";

export async function listPlants(userId: string) {
  const { data, error } = await supabase
    .from("plants")
    .select("*")
    .eq("user_id", userId)
    .is("archived_at", null)
    .order("created_at", { ascending: false })
    .returns<Plant[]>();

  if (error) throw error;
  return data;
}

export async function getPlant(plantId: string) {
  const { data, error } = await supabase
    .from("plants")
    .select("*")
    .eq("id", plantId)
    .single<Plant>();

  if (error) throw error;
  return data;
}

export async function createPlant(userId: string, payload: PlantInput) {
  const { data, error } = await supabase
    .from("plants")
    .insert({ ...payload, user_id: userId })
    .select()
    .single<Plant>();

  if (error) throw error;
  return data;
}

export async function updatePlant(plantId: string, payload: Partial<PlantInput>) {
  const { data, error } = await supabase
    .from("plants")
    .update({ ...payload, updated_at: new Date().toISOString() })
    .eq("id", plantId)
    .select()
    .single<Plant>();

  if (error) throw error;
  return data;
}

export async function archivePlant(plantId: string) {
  const { error } = await supabase
    .from("plants")
    .update({ archived_at: new Date().toISOString() })
    .eq("id", plantId);

  if (error) throw error;
}

export async function listCareEvents(plantId: string, limit = 20) {
  const { data, error } = await supabase
    .from("care_events")
    .select("*")
    .eq("plant_id", plantId)
    .order("happened_at", { ascending: false })
    .limit(limit)
    .returns<CareEvent[]>();

  if (error) throw error;
  return data;
}

export async function logCareEvent(params: {
  plantId: string;
  userId: string;
  kind: CareEventKind;
  note?: string;
  happenedAt?: Date;
}) {
  const happenedAt = (params.happenedAt ?? new Date()).toISOString();

  const { data, error } = await supabase
    .from("care_events")
    .insert({
      plant_id: params.plantId,
      user_id: params.userId,
      kind: params.kind,
      note: params.note ?? null,
      happened_at: happenedAt,
    })
    .select()
    .single<CareEvent>();

  if (error) throw error;

  await advancePlantTask({
    plantId: params.plantId,
    kind: params.kind,
    from: params.happenedAt ?? new Date(),
  });

  if (params.kind === "water") {
    const { error: plantError } = await supabase
      .from("plants")
      .update({ last_watered_at: happenedAt, updated_at: happenedAt })
      .eq("id", params.plantId);

    if (plantError) throw plantError;
  }

  return data;
}

export async function listUserCareEvents(userId: string, limit = 500) {
  const { data, error } = await supabase
    .from("care_events")
    .select("*")
    .eq("user_id", userId)
    .order("happened_at", { ascending: false })
    .limit(limit)
    .returns<CareEvent[]>();

  if (error) throw error;
  return data;
}
