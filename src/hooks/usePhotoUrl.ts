import { useQuery } from "@tanstack/react-query";

import { getPhotoUrl } from "@/services/supabase/storage";

export function usePhotoUrl(path: string | null | undefined) {
  return useQuery({
    queryKey: ["photo-url", path],
    queryFn: () => getPhotoUrl(path!),
    enabled: !!path,
    staleTime: 50 * 60 * 1000,
    gcTime: 55 * 60 * 1000,
  });
}
