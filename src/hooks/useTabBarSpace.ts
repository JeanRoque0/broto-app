import { useBottomTabBarHeight } from "expo-router/js-tabs";

import { theme } from "@/style/theme";

export function useTabBarSpace() {
  return useBottomTabBarHeight() + theme.spacing.s4;
}
