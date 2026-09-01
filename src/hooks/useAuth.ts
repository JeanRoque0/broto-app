import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

import { unregisterPushToken } from "@/services/push";
import { clearPersistedCache } from "@/services/queryPersist";
import { supabase } from "@/services/supabase/client";
import { useAnalysisStore, useAuthStore } from "@/store";

export function useAuthListener() {
  const setSession = useAuthStore((state) => state.setSession);
  const setHydrated = useAuthStore((state) => state.setHydrated);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const queryClient = useQueryClient();

  useEffect(() => {
    const { data: subscription } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_OUT") {
          clearAuth();
          queryClient.clear();
          useAnalysisStore.getState().reset();

          unregisterPushToken().catch(() => undefined);
          clearPersistedCache().catch(() => undefined);
        } else {
          setSession(session);
        }

        setHydrated(true);
      },
    );

    return () => subscription.subscription.unsubscribe();
  }, [setSession, setHydrated, clearAuth, queryClient]);
}

export function useAuth() {
  const session = useAuthStore((state) => state.session);
  const user = useAuthStore((state) => state.user);
  const hydrated = useAuthStore((state) => state.hydrated);

  return {
    session,
    user,
    userId: user?.id ?? null,
    isAuthenticated: !!session,
    hydrated,
  };
}
