import { Feather, MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Platform } from "react-native";

import { theme } from "@/style/theme";

type BackIconProps = {
  size?: number;
  color?: string;
};

export function BackIcon({
  size = 18,
  color = theme.text.primary,
}: BackIconProps) {
  if (Platform.OS === "ios") {
    return <MaterialIcons name="arrow-back-ios-new" size={size} color={color} />;
  }
  return <Feather name="arrow-left" size={size} color={color} />;
}
