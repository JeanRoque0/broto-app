import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

import { Loader } from "@/components/ui/Loader";
import { useAuth } from "@/hooks/useAuth";
import { theme } from "@/style/theme";

const EXCHANGE_TIMEOUT = 8000;

export default function AuthCallbackScreen() {
  const { isAuthenticated } = useAuth();
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setTimedOut(true), EXCHANGE_TIMEOUT);
    return () => clearTimeout(timer);
  }, []);

  if (isAuthenticated || timedOut) {
    return <Redirect href="/" />;
  }

  return (
    <View style={styles.container}>
      <Loader />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.surface.base,
  },
});
