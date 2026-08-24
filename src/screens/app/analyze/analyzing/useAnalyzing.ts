import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";

import { useAuth } from "@/hooks/useAuth";
import { profileKeys } from "@/hooks/useProfile";
import { identify } from "@/services/api/identify";
import { uploadPhoto } from "@/services/supabase/storage";
import { useAnalysisStore } from "@/store";
import { isAnalysisError } from "@/types/identification";

type Phase =
  "sending" | "reading" | "illegible" | "failed" | "dailyCap" | "monthCap";

export function useAnalyzing() {
  const router = useRouter();
  const { userId } = useAuth();
  const queryClient = useQueryClient();
  const photos = useAnalysisStore((state) => state.photos);
  const plantId = useAnalysisStore((state) => state.plantId);
  const setResult = useAnalysisStore((state) => state.setResult);
  const setPhotoPaths = useAnalysisStore((state) => state.setPhotoPaths);
  const setIdentificationId = useAnalysisStore(
    (state) => state.setIdentificationId,
  );
  const clearPhotos = useAnalysisStore((state) => state.clearPhotos);

  const [phase, setPhase] = useState<Phase>("sending");
  const [sent, setSent] = useState(0);
  const started = useRef(false);

  const run = useCallback(async () => {
    if (!userId || photos.length === 0) return;

    setPhase("sending");
    setSent(0);

    try {
      const paths: string[] = [];
      for (const uri of photos) {
        paths.push(await uploadPhoto({ userId, uri }));
        setSent((count) => count + 1);
      }

      setPhotoPaths(paths);
      setPhase("reading");
      const response = await identify({
        photoPaths: paths,
        plantId: plantId ?? undefined,
      });

      queryClient.invalidateQueries({ queryKey: profileKeys.detail(userId) });

      if (isAnalysisError(response)) {
        setPhase("illegible");
        return;
      }

      setIdentificationId(response.identification_id);
      setResult(response);
      router.replace("/(app)/analyze/result");
    } catch (error) {
      const status = (error as { response?: { status?: number } })?.response
        ?.status;

      if (status === 402) {
        router.replace("/(app)/paywall");
        return;
      }

      if (status === 429) {
        const code = (error as { response?: { data?: { erro?: string } } })
          ?.response?.data?.erro;

        setPhase(code === "limite_mensal" ? "monthCap" : "dailyCap");
        return;
      }

      setPhase("failed");
    }
  }, [
    userId,
    photos,
    plantId,
    setResult,
    setPhotoPaths,
    setIdentificationId,
    queryClient,
    router,
  ]);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    run();
  }, [run]);

  return {
    phase,
    photo: photos[0],
    sent,
    total: photos.length,
    retry: () => {
      started.current = true;
      run();
    },
    newPhoto: () => {
      clearPhotos();
      router.replace("/(app)/analyze/camera");
    },
    close: () => router.replace("/(app)/(tabs)"),
  };
}
