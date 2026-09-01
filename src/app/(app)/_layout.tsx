import { Redirect, Stack } from "expo-router";

import { CareReminders } from "@/components/CareReminders";
import { OfflineNotice } from "@/components/ui/OfflineNotice";
import { ProfileGate } from "@/components/ProfileGate";
import { useAuth } from "@/hooks/useAuth";
import { theme } from "@/style/theme";
import { needsConsent } from "@/utils/legal";

export default function AppLayout() {
  const { isAuthenticated, hydrated } = useAuth();

  if (hydrated && !isAuthenticated) {
    return <Redirect href="/(auth)/welcome" />;
  }

  return (
    <ProfileGate>
      {(profile) => {
        if (needsConsent(profile)) {
          return <Redirect href="/(auth)/consent" />;
        }

        return (
          <>
            <CareReminders />

            <OfflineNotice />

            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: theme.surface.base },
              }}
            >
              <Stack.Screen name="(tabs)" />
              <Stack.Screen
                name="paywall"
                options={{ presentation: "modal" }}
              />
            </Stack>
          </>
        );
      }}
    </ProfileGate>
  );
}
