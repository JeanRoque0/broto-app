import { useEffect, useState } from "react";
import {
  Platform,
  RefreshControl,
  type RefreshControlProps,
} from "react-native";

import { theme } from "@/style/theme";

const IOS_TINT_APPLY_DELAY_MS = 50;

export function AppRefreshControl(
  props: Omit<RefreshControlProps, "tintColor" | "colors">,
) {
  const [applyTint, setApplyTint] = useState(Platform.OS !== "ios");

  useEffect(() => {
    if (Platform.OS !== "ios") return;

    const timeout = setTimeout(
      () => setApplyTint(true),
      IOS_TINT_APPLY_DELAY_MS,
    );

    return () => clearTimeout(timeout);
  }, []);

  return (
    <RefreshControl
      tintColor={applyTint ? theme.primary.clay : undefined}
      colors={[theme.primary.clay]}
      {...props}
    />
  );
}
