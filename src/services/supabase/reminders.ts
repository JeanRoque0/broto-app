import { ReminderEvent } from "@/types/reminder";

import { supabase } from "./client";

const LIMIT = 60;

export async function listReminderEvents(userId: string) {
  const { data, error } = await supabase
    .from("reminder_events")
    .select("id, plant_id, kind, title, body, sent_at, read_at")
    .eq("user_id", userId)
    .order("sent_at", { ascending: false })
    .limit(LIMIT);

  if (error) throw error;
  return (data ?? []) as ReminderEvent[];
}

export async function countUnreadReminders(userId: string) {
  const { count, error } = await supabase
    .from("reminder_events")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .is("read_at", null);

  if (error) throw error;
  return count ?? 0;
}

export async function markRemindersRead(userId: string) {
  const { error } = await supabase
    .from("reminder_events")
    .update({ read_at: new Date().toISOString() })
    .eq("user_id", userId)
    .is("read_at", null);

  if (error) throw error;
}
