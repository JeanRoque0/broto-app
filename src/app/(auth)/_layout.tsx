import { Redirect, Stack, useSegments } from "expo-router";

import { ProfileGate } from "@/components/ProfileGate";
import { useAuth } from "@/hooks/useAuth";
import { theme } from "@/style/theme";
import { needsConsent } from "@/utils/legal";

function AuthStack() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.surface.base },
      }}
    />
  );
}

export default function AuthLayout() {
  const { isAuthenticated, hydrated } = useAuth();
  const segments = useSegments();
  const onConsent = segments[segments.length - 1] === "consent";

  if (!hydrated || !isAuthenticated) {
    return <AuthStack />;
  }

  return (
    <ProfileGate>
      {(profile) => {
        if (!needsConsent(profile)) {
          return <Redirect href="/(app)/(tabs)" />;
        }
        if (!onConsent) {
          return <Redirect href="/(auth)/consent" />;
        }
        return <AuthStack />;
      }}
    </ProfileGate>
  );
}
