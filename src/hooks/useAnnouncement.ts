import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import { FALLBACK_LANGUAGE } from "@/constants/languages";
import { useAuth } from "@/hooks/useAuth";
import { profileKeys, useProfile } from "@/hooks/useProfile";
import {
  dismissAnnouncement,
  getActiveAnnouncement,
} from "@/services/supabase/announcements";
import { Announcement } from "@/types/announcement";

export const announcementKeys = {
  active: ["announcement", "active"] as const,
};

function pick(field: Record<string, string>, language: string) {
  return field[language] ?? field[FALLBACK_LANGUAGE] ?? "";
}

export function useAnnouncement() {
  const { i18n } = useTranslation();
  const { userId, isAuthenticated } = useAuth();
  const { data: profile } = useProfile();
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: announcementKeys.active,
    queryFn: getActiveAnnouncement,
    enabled: isAuthenticated,
    staleTime: 5 * 60_000,
  });

  const dismiss = useMutation({
    mutationFn: (announcement: Announcement) =>
      dismissAnnouncement(userId!, announcement.id),
    onSuccess: (_result, announcement) => {
      queryClient.setQueryData(profileKeys.detail(userId!), (previous: unknown) =>
        previous
          ? { ...(previous as object), dismissed_announcement: announcement.id }
          : previous,
      );
    },
  });

  const visible = !!data && !!profile && profile.dismissed_announcement !== data.id;

  return {
    announcement: visible ? data : null,
    title: data ? pick(data.title, i18n.language) : "",
    body: data ? pick(data.body, i18n.language) : "",
    detail: data
      ? pick(data.detail ?? data.body, i18n.language) ||
        pick(data.body, i18n.language)
      : "",
    dismiss: () => data && dismiss.mutate(data),
  };
}
