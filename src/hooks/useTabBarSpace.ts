import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

import { theme } from "@/style/theme";

export function useTabBarSpace() {
  return useBottomTabBarHeight() + theme.spacing.s4;
}
