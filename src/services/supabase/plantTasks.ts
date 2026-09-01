import { supabase } from "@/services/supabase/client";
import { PlantTask } from "@/types/plant";

export async function listPlantTasks(userId: string) {
  const { data, error } = await supabase
    .from("plant_tasks")
    .select("*, plants!inner(archived_at)")
    .eq("user_id", userId)
    .is("plants.archived_at", null);

  if (error) throw error;

  return (data ?? []).map(({ plants, ...task }) => task) as PlantTask[];
}

export async function updatePlantTask(
  taskId: string,
  payload: Partial<
    Pick<PlantTask, "interval_days" | "next_at" | "remind_at" | "enabled">
  >,
) {
  const { error } = await supabase
    .from("plant_tasks")
    .update(payload)
    .eq("id", taskId);

  if (error) throw error;
}

export async function advancePlantTask(params: {
  plantId: string;
  kind: string;
  from: Date;
}) {
  const { data, error } = await supabase
    .from("plant_tasks")
    .select("id, interval_days")
    .eq("plant_id", params.plantId)
    .eq("kind", params.kind)
    .maybeSingle<{ id: string; interval_days: number }>();

  if (error || !data) return;

  const next = new Date(params.from);
  next.setDate(next.getDate() + data.interval_days);

  await supabase
    .from("plant_tasks")
    .update({ next_at: toDateString(next) })
    .eq("id", data.id);
}

export async function scheduleRecheck(params: {
  plantId: string;
  userId: string;
  days: number;
  remindAt: string;
}) {
  const next = new Date();
  next.setDate(next.getDate() + params.days);

  const { error } = await supabase.from("plant_tasks").upsert(
    {
      plant_id: params.plantId,
      user_id: params.userId,
      kind: "recheck",
      interval_days: params.days,
      next_at: toDateString(next),
      remind_at: params.remindAt,
      enabled: true,
    },
    { onConflict: "plant_id,kind" },
  );

  if (error) throw error;
}

export async function cancelRecheck(plantId: string) {
  const { error } = await supabase
    .from("plant_tasks")
    .delete()
    .eq("plant_id", plantId)
    .eq("kind", "recheck");

  if (error) throw error;
}

export function toDateString(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
