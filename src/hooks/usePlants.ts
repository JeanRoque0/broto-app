import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";

import { useAuth } from "@/hooks/useAuth";
import {
  listPlantIdentifications,
  resolveIdentification,
} from "@/services/supabase/identifications";
import {
  archivePlant,
  createPlant,
  getPlant,
  listCareEvents,
  listPlants,
  listUserCareEvents,
  logCareEvent,
  updatePlant,
} from "@/services/supabase/plants";
import { CareEventKind, PlantInput } from "@/types/plant";
import { getWateringInfo } from "@/utils/watering";

export const plantKeys = {
  all: ["plants"] as const,
  list: (userId: string) => ["plants", "list", userId] as const,
  detail: (plantId: string) => ["plants", "detail", plantId] as const,
  careEvents: (plantId: string) => ["plants", "care-events", plantId] as const,
  allCareEvents: (userId: string) =>
    ["plants", "care-events", "all", userId] as const,
  identifications: (plantId: string) =>
    ["plants", "identifications", plantId] as const,
};

export function usePlants() {
  const { userId } = useAuth();

  const query = useQuery({
    queryKey: plantKeys.list(userId ?? ""),
    queryFn: () => listPlants(userId!),
    enabled: !!userId,
  });

  const plants = useMemo(() => query.data ?? [], [query.data]);

  return { ...query, plants };
}

export function usePlant(plantId: string) {
  const query = useQuery({
    queryKey: plantKeys.detail(plantId),
    queryFn: () => getPlant(plantId),
    enabled: !!plantId,
  });

  const watering = useMemo(
    () => (query.data ? getWateringInfo(query.data) : null),
    [query.data],
  );

  return { ...query, watering };
}

export function useCareEvents(plantId: string) {
  return useQuery({
    queryKey: plantKeys.careEvents(plantId),
    queryFn: () => listCareEvents(plantId),
    enabled: !!plantId,
  });
}

export function useUserCareEvents() {
  const { userId } = useAuth();

  return useQuery({
    queryKey: plantKeys.allCareEvents(userId ?? ""),
    queryFn: () => listUserCareEvents(userId!),
    enabled: !!userId,
  });
}

export function usePlantIdentifications(plantId: string) {
  return useQuery({
    queryKey: plantKeys.identifications(plantId),
    queryFn: () => listPlantIdentifications(plantId),
    enabled: !!plantId,
  });
}

export function useResolveIdentification(plantId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: { id: string; resolved: boolean }) =>
      resolveIdentification(params.id, params.resolved),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: plantKeys.identifications(plantId),
      });
    },
  });
}

export function useCreatePlant() {
  const { userId } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: PlantInput) => createPlant(userId!, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: plantKeys.list(userId!) });
    },
  });
}

export function useUpdatePlant(plantId: string) {
  const { userId } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Partial<PlantInput>) => updatePlant(plantId, payload),
    onSuccess: (plant) => {
      queryClient.setQueryData(plantKeys.detail(plantId), plant);
      queryClient.invalidateQueries({ queryKey: plantKeys.list(userId!) });
    },
  });
}

export function useArchivePlant() {
  const { userId } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (plantId: string) => archivePlant(plantId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: plantKeys.list(userId!) });
    },
  });
}

export function useLogTask() {
  const { userId } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: { plantId: string; kind: CareEventKind }) =>
      logCareEvent({
        plantId: params.plantId,
        kind: params.kind,
        userId: userId!,
      }),
    onSuccess: (_event, params) => {
      queryClient.invalidateQueries({ queryKey: plantKeys.list(userId!) });
      queryClient.invalidateQueries({
        queryKey: plantKeys.allCareEvents(userId!),
      });
      queryClient.invalidateQueries({
        queryKey: plantKeys.detail(params.plantId),
      });
      queryClient.invalidateQueries({
        queryKey: plantKeys.careEvents(params.plantId),
      });
    },
  });
}

export function useLogCare(plantId: string) {
  const { userId } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: { kind: CareEventKind; note?: string }) =>
      logCareEvent({ plantId, userId: userId!, ...params }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: plantKeys.list(userId!) });
      queryClient.invalidateQueries({ queryKey: plantKeys.detail(plantId) });
      queryClient.invalidateQueries({
        queryKey: plantKeys.careEvents(plantId),
      });
    },
  });
}
