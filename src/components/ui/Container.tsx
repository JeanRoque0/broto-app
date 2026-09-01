import { StyleSheet, View } from "react-native";
import {
  SafeAreaView,
  SafeAreaViewProps,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import { OfflineNotice } from "@/components/ui/OfflineNotice";
import { useOnline } from "@/hooks/useOnline";
import { useStatusBarStyle } from "@/hooks/useStatusBarStyle";
import { theme } from "@/style/theme";

export function Container({ style, children, ...rest }: SafeAreaViewProps) {
  const online = useOnline();
  const insets = useSafeAreaInsets();

  useStatusBarStyle(online ? "dark" : "light");

  return (
    <SafeAreaView
      edges={["left", "right", "bottom"]}
      style={[styles.container, style]}
      {...rest}
    >
      <OfflineNotice />

      <View style={[styles.body, online && { paddingTop: insets.top }]}>
        {children}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.surface.base,
  },
  body: {
    flex: 1,
  },
});
