import type { Session, User } from "@supabase/supabase-js";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { Profile } from "@/types/profile";

import storage from "./storage";

interface AuthState {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  hydrated: boolean;

  setSession: (session: Session | null) => void;
  setProfile: (profile: Profile | null) => void;
  setHydrated: (hydrated: boolean) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      session: null,
      user: null,
      profile: null,
      hydrated: false,

      setSession: (session) => set({ session, user: session?.user ?? null }),
      setProfile: (profile) => set({ profile }),
      setHydrated: (hydrated) => set({ hydrated }),
      clearAuth: () => set({ session: null, user: null, profile: null }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => storage),
      partialize: ({ session, user, profile }) => ({ session, user, profile }),
    },
  ),
);
