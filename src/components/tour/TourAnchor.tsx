import { useCallback } from "react";
import { StyleSheet, View } from "react-native";

import { registerAnchor } from "./registry";

export function TourAnchor({ id }: { id: string }) {
  const ref = useCallback((node: View | null) => registerAnchor(id, node), [id]);

  return (
    <View
      ref={ref}
      collapsable={false}
      pointerEvents="none"
      style={StyleSheet.absoluteFill}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    />
  );
}
