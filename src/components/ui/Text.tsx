import { Text as RNText, StyleSheet, TextProps, TextStyle } from "react-native";

import { FontFamily, maxScaleFor, resolveFontFamily } from "@/style/typography";

type Props = TextProps & {
  family?: FontFamily;
};

export function Text({
  family = "sans",
  style,
  maxFontSizeMultiplier,
  ...rest
}: Props) {
  const { fontWeight, ...flat } = StyleSheet.flatten(style) ?? {};

  const resolvedStyle: TextStyle = {
    ...flat,
    fontFamily: resolveFontFamily(family, fontWeight),
  };

  return (
    <RNText
      style={resolvedStyle}
      maxFontSizeMultiplier={maxFontSizeMultiplier ?? maxScaleFor(flat.fontSize)}
      {...rest}
    />
  );
}
