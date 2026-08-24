import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useAuth } from "@/hooks/useAuth";
import { plantKeys } from "@/hooks/usePlants";
import {
  listPlantTasks,
  updatePlantTask,
} from "@/services/supabase/plantTasks";
import { PlantTask } from "@/types/plant";

export const taskKeys = {
  list: (userId: string) => ["plant-tasks", userId] as const,
};

export function usePlantTasks() {
  const { userId } = useAuth();

  const query = useQuery({
    queryKey: taskKeys.list(userId ?? ""),
    queryFn: () => listPlantTasks(userId!),
    enabled: !!userId,
  });

  return { ...query, tasks: query.data ?? [] };
}

export function useUpdatePlantTask() {
  const { userId } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: {
      taskId: string;
      payload: Partial<
        Pick<PlantTask, "interval_days" | "next_at" | "enabled">
      >;
    }) => updatePlantTask(params.taskId, params.payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.list(userId!) });
      queryClient.invalidateQueries({ queryKey: plantKeys.all });
    },
  });
}
