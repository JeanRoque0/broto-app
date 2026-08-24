import { supabase } from "@/services/supabase/client";
import { PlantGroup } from "@/types/plant";

export async function listGroups(userId: string) {
  const { data, error } = await supabase
    .from("plant_groups")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: true })
    .returns<PlantGroup[]>();

  if (error) throw error;
  return data;
}

export async function createGroup(userId: string, name: string) {
  const { data, error } = await supabase
    .from("plant_groups")
    .insert({ user_id: userId, name })
    .select()
    .single<PlantGroup>();

  if (error) throw error;
  return data;
}

export async function renameGroup(groupId: string, name: string) {
  const { error } = await supabase
    .from("plant_groups")
    .update({ name })
    .eq("id", groupId);

  if (error) throw error;
}

export async function deleteGroup(groupId: string) {
  const { error } = await supabase
    .from("plant_groups")
    .delete()
    .eq("id", groupId);

  if (error) throw error;
}

export async function setGroupPlants(groupId: string, plantIds: string[]) {
  const { error: clearError } = await supabase
    .from("plants")
    .update({ group_id: null })
    .eq("group_id", groupId);

  if (clearError) throw clearError;
  if (plantIds.length === 0) return;

  const { error } = await supabase
    .from("plants")
    .update({ group_id: groupId })
    .in("id", plantIds);

  if (error) throw error;
}
