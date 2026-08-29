import { Announcement } from "@/types/announcement";

import { supabase } from "./client";

export async function getActiveAnnouncement() {
  const { data, error } = await supabase
    .from("announcements")
    .select("id, kind, title, body, starts_at, notify_at, ends_at")
    .order("starts_at", { ascending: false })
    .limit(1)
    .maybeSingle<Announcement>();

  if (error) throw error;
  return data;
}

export async function dismissAnnouncement(userId: string, id: string) {
  const { error } = await supabase
    .from("profiles")
    .update({ dismissed_announcement: id })
    .eq("id", userId);

  if (error) throw error;
}
