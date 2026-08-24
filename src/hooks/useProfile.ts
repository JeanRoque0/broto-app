import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useFocusEffect } from "expo-router";
import { useCallback, useEffect } from "react";

import { useAuth } from "@/hooks/useAuth";
import {
  getProfile,
  ProfileUpdate,
  updateProfile,
} from "@/services/supabase/profile";
import { useAuthStore } from "@/store";
import { getCredits } from "@/utils/credits";

export const profileKeys = {
  detail: (userId: string) => ["profile", userId] as const,
};

export function useProfile() {
  const { userId } = useAuth();
  const setProfile = useAuthStore((state) => state.setProfile);

  const query = useQuery({
    queryKey: profileKeys.detail(userId ?? ""),
    queryFn: () => getProfile(userId!),
    enabled: !!userId,
  });

  useEffect(() => {
    if (query.data) setProfile(query.data);
  }, [query.data, setProfile]);

  return query;
}

export function useUpdateProfile() {
  const { userId } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ProfileUpdate) => updateProfile(userId!, payload),
    onSuccess: (profile) => {
      queryClient.setQueryData(profileKeys.detail(userId!), profile);
    },
  });
}

export function useCredits() {
  const { data: profile } = useProfile();
  return getCredits(profile ?? null);
}

export function useRefreshProfileOnFocus() {
  const { refetch } = useProfile();

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );
}
