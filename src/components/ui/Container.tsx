import { StyleSheet } from "react-native";
import {
  SafeAreaView,
  SafeAreaViewProps,
} from "react-native-safe-area-context";

import { useStatusBarStyle } from "@/hooks/useStatusBarStyle";
import { theme } from "@/style/theme";

export function Container({ style, children, ...rest }: SafeAreaViewProps) {
  useStatusBarStyle("dark");

  return (
    <SafeAreaView style={[styles.container, style]} {...rest}>
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.surface.base,
  },
});
