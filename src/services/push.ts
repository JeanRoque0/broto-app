import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

import { supabase } from "@/services/supabase/client";

function projectId() {
  return (
    Constants.expoConfig?.extra?.eas?.projectId ??
    Constants.easConfig?.projectId ??
    null
  );
}

export function pushSupported() {
  return Device.isDevice && !!projectId();
}

export async function getPushToken() {
  if (!pushSupported()) return null;

  try {
    const { data } = await Notifications.getExpoPushTokenAsync({
      projectId: projectId()!,
    });

    return data;
  } catch {
    return null;
  }
}

export async function registerPushToken(userId: string) {
  const token = await getPushToken();
  if (!token) return null;

  const { error } = await supabase.from("push_tokens").upsert(
    {
      token,
      user_id: userId,
      platform: Platform.OS,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "token" },
  );

  if (error) return null;
  return token;
}

export async function unregisterPushToken() {
  const token = await getPushToken();
  if (!token) return;

  await supabase.from("push_tokens").delete().eq("token", token);
}
