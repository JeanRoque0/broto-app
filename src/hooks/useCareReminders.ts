import * as Localization from "expo-localization";
import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

import { useProfile, useUpdateProfile } from "@/hooks/useProfile";
import {
  configureNotifications,
  ensureNotificationPermission,
} from "@/services/notifications";
import { registerPushToken } from "@/services/push";

const SEEN_INTERVAL_MS = 60 * 60 * 1000;

export function useCareReminders() {
  const { i18n } = useTranslation();
  const { data: profile } = useProfile();
  const { mutate: updateProfile } = useUpdateProfile();
  const registered = useRef(false);
  const seenAt = useRef(0);

  useEffect(() => {
    configureNotifications();
  }, []);

  useEffect(() => {
    if (!profile || registered.current) return;
    registered.current = true;

    ensureNotificationPermission().then((granted) => {
      if (granted) registerPushToken(profile.id);
    });
  }, [profile]);

  const sync = useCallback(() => {
    if (!profile) return;

    const zone = Localization.getCalendars()[0]?.timeZone;
    const payload: Record<string, string> = {};

    if (!profile.timezone && zone) payload.timezone = zone;
    if (profile.language !== i18n.language) payload.language = i18n.language;

    const now = Date.now();

    if (now - seenAt.current > SEEN_INTERVAL_MS) {
      seenAt.current = now;
      payload.last_seen_at = new Date().toISOString();
    }

    if (Object.keys(payload).length > 0) updateProfile(payload);
  }, [profile, i18n.language, updateProfile]);

  useFocusEffect(sync);
}
