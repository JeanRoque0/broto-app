import React from "react";
import { StyleProp, StyleSheet, TextStyle } from "react-native";

import { type } from "@/style/typography";

import { Text } from "./Text";

type EyebrowProps = {
  children: string;
  color?: string;
  style?: StyleProp<TextStyle>;
};

export function Eyebrow({ children, color, style }: EyebrowProps) {
  return (
    <Text family="mono" style={[styles.text, color ? { color } : null, style]}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: type.eyebrow,
});
