import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";

import { useAuth } from "@/hooks/useAuth";
import { listIdentifications } from "@/services/supabase/identifications";
import { useAnalysisStore } from "@/store";
import { Identification } from "@/types/identification";

const HISTORY_LIMIT = 20;

export function useAnalyses() {
  const router = useRouter();
  const { userId } = useAuth();
  const setResult = useAnalysisStore((state) => state.setResult);
  const setPhotoPaths = useAnalysisStore((state) => state.setPhotoPaths);
  const setIdentificationId = useAnalysisStore(
    (state) => state.setIdentificationId,
  );
  const setPlantId = useAnalysisStore((state) => state.setPlantId);
  const setWasHelpful = useAnalysisStore((state) => state.setWasHelpful);
  const setFromHistory = useAnalysisStore((state) => state.setFromHistory);
  const reset = useAnalysisStore((state) => state.reset);

  const query = useQuery({
    queryKey: ["identifications", userId ?? ""],
    queryFn: () => listIdentifications(userId!, HISTORY_LIMIT),
    enabled: !!userId,
  });

  function open(item: Identification) {
    reset();
    setPhotoPaths([item.photo_path]);
    setResult(item.result);
    setIdentificationId(item.id);
    setPlantId(item.plant_id);
    setWasHelpful(item.was_helpful);
    setFromHistory(true);
    router.push("/(app)/analyze/result");
  }

  return {
    items: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    isRefetching: query.isRefetching,
    refetch: query.refetch,
    open,
    startAnalysis: () => {
      reset();
      router.push("/(app)/analyze/camera");
    },
  };
}
