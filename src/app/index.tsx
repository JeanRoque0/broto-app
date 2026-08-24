import { Redirect } from "expo-router";
import { StyleSheet, View } from "react-native";

import { Loader } from "@/components/ui/Loader";
import { useAuth } from "@/hooks/useAuth";
import { useOnboardingStore } from "@/store";
import { theme } from "@/style/theme";

export default function Index() {
  const { isAuthenticated, hydrated } = useAuth();
  const onboardingCompleted = useOnboardingStore((state) => state.completed);

  if (!hydrated) {
    return (
      <View style={styles.container}>
        <Loader />
      </View>
    );
  }

  if (isAuthenticated) {
    return <Redirect href="/(app)/(tabs)" />;
  }

  if (!onboardingCompleted) {
    return <Redirect href="/(auth)/onboarding" />;
  }

  return <Redirect href="/(auth)/welcome" />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.surface.base,
  },
});
