import type { Session, User } from "@supabase/supabase-js";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";


import storage from "./storage";

interface AuthState {
  session: Session | null;
  user: User | null;
  hydrated: boolean;

  setSession: (session: Session | null) => void;
  setHydrated: (hydrated: boolean) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      session: null,
      user: null,
      hydrated: false,

      setSession: (session) => set({ session, user: session?.user ?? null }),
      setHydrated: (hydrated) => set({ hydrated }),
      clearAuth: () => set({ session: null, user: null }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => storage),
      partialize: ({ session, user }) => ({ session, user }),
    },
  ),
);
