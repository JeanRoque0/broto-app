import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useAuth } from "@/hooks/useAuth";
import { plantKeys } from "@/hooks/usePlants";
import {
  createGroup,
  deleteGroup,
  listGroups,
  renameGroup,
  setGroupPlants,
} from "@/services/supabase/groups";

export const groupKeys = {
  list: (userId: string) => ["plant-groups", userId] as const,
};

export function useGroups() {
  const { userId } = useAuth();

  const query = useQuery({
    queryKey: groupKeys.list(userId ?? ""),
    queryFn: () => listGroups(userId!),
    enabled: !!userId,
  });

  return { ...query, groups: query.data ?? [] };
}

export function useCreateGroup() {
  const { userId } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (name: string) => createGroup(userId!, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: groupKeys.list(userId!) });
    },
  });
}

export function useRenameGroup() {
  const { userId } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: { groupId: string; name: string }) =>
      renameGroup(params.groupId, params.name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: groupKeys.list(userId!) });
    },
  });
}

export function useSetGroupPlants() {
  const { userId } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: { groupId: string; plantIds: string[] }) =>
      setGroupPlants(params.groupId, params.plantIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: plantKeys.list(userId!) });
    },
  });
}

export function useDeleteGroup() {
  const { userId } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (groupId: string) => deleteGroup(groupId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: groupKeys.list(userId!) });
      queryClient.invalidateQueries({ queryKey: plantKeys.list(userId!) });
    },
  });
}
