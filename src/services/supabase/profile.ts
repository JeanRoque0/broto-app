import { supabase } from "@/services/supabase/client";
import { Profile } from "@/types/profile";

export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle<Profile>();

  if (error) throw error;
  if (!data) throw new Error("profile_not_ready");
  return data;
}

export type ProfileUpdate = Partial<
  Pick<
    Profile,
    | "display_name"
    | "avatar_path"
    | "timezone"
    | "temperature_unit"
    | "reminder_time"
    | "notifications_enabled"
  >
>;

export async function acceptTerms(params: {
  userId: string;
  tips: boolean;
  version: string;
}) {
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from("profiles")
    .update({
      accepted_terms_at: now,
      terms_version: params.version,
      accepted_tips: params.tips,
      accepted_tips_at: params.tips ? now : null,
    })
    .eq("id", params.userId)
    .select()
    .single<Profile>();

  if (error) throw error;
  return data;
}

export async function updateProfile(userId: string, payload: ProfileUpdate) {
  const { data, error } = await supabase
    .from("profiles")
    .update(payload)
    .eq("id", userId)
    .select()
    .single<Profile>();

  if (error) throw error;
  return data;
}
