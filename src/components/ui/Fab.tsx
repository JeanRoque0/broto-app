import React from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";

import { TourAnchor } from "@/components/tour/TourAnchor";
import { RipplePressable } from "@/components/ui/RipplePressable";
import { theme } from "@/style/theme";

export const FAB_SIZE = 48;

const SIZE = FAB_SIZE;

type FabProps = {
  children: React.ReactNode;
  onPress: () => void;
  bottom: number;
  accessibilityLabel: string;
  style?: StyleProp<ViewStyle>;
  tourId?: string;
};

export function Fab({
  children,
  onPress,
  bottom,
  accessibilityLabel,
  style,
  tourId,
}: FabProps) {
  return (
    <View style={[styles.anchor, { bottom }, style]} pointerEvents="box-none">
      <RipplePressable
        onPress={onPress}
        borderless
        radius={SIZE / 2}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        style={styles.button}
        pressScale={0.92}
      >
        {children}
        {tourId && <TourAnchor id={tourId} />}
      </RipplePressable>
    </View>
  );
}

const styles = StyleSheet.create({
  anchor: {
    position: "absolute",
    right: theme.screenPadding,
  },
  button: {
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.primary.clay,
    shadowColor: theme.text.primary,
    shadowOpacity: 0.22,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
});
