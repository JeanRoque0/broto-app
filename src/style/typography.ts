import { TextStyle } from "react-native";

import { theme } from "./theme";

export const fontSize = {
  s1: 10,
  s2: 11,
  s3: 11.5,
  s4: 12.5,
  s5: 13,
  s6: 13.5,
  s7: 14,
  s8: 15,
  s9: 16,
  s10: 18,
  s11: 21,
  s12: 25,
  s13: 28,
} as const;

const MAX_RENDERED_SIZE = 34;
const MAX_SCALE = 1.8;
const MIN_SCALE = 1.2;

export function maxScaleFor(size?: number): number {
  if (typeof size !== "number" || size <= 0) return MAX_SCALE;
  return Math.min(MAX_SCALE, Math.max(MIN_SCALE, MAX_RENDERED_SIZE / size));
}

export type FontFamily = "sans" | "display" | "mono";

export const fonts = {
  display: {
    "400": "Fraunces_400Regular",
    "600": "Fraunces_600SemiBold",
  },
  sans: {
    "400": "DMSans_400Regular",
    "500": "DMSans_500Medium",
    "700": "DMSans_700Bold",
  },
  mono: {
    "400": "DMMono_400Regular",
    "500": "DMMono_500Medium",
  },
} as const;

const weightMap: Record<FontFamily, Record<string, string>> = {
  display: {
    "300": fonts.display["400"],
    "400": fonts.display["400"],
    normal: fonts.display["400"],
    "500": fonts.display["600"],
    "600": fonts.display["600"],
    "700": fonts.display["600"],
    "800": fonts.display["600"],
    "900": fonts.display["600"],
    bold: fonts.display["600"],
  },
  sans: {
    "300": fonts.sans["400"],
    "400": fonts.sans["400"],
    normal: fonts.sans["400"],
    "500": fonts.sans["500"],
    "600": fonts.sans["500"],
    "700": fonts.sans["700"],
    "800": fonts.sans["700"],
    "900": fonts.sans["700"],
    bold: fonts.sans["700"],
  },
  mono: {
    "300": fonts.mono["400"],
    "400": fonts.mono["400"],
    normal: fonts.mono["400"],
    "500": fonts.mono["500"],
    "600": fonts.mono["500"],
    "700": fonts.mono["500"],
    "800": fonts.mono["500"],
    "900": fonts.mono["500"],
    bold: fonts.mono["500"],
  },
};

export function resolveFontFamily(
  family: FontFamily = "sans",
  fontWeight?: TextStyle["fontWeight"],
): string {
  const table = weightMap[family];
  if (!fontWeight) return table["400"];
  return table[String(fontWeight)] ?? table["400"];
}

export const type = {
  display: {
    fontSize: fontSize.s12,
    fontWeight: "600",
    lineHeight: 30,
    letterSpacing: -0.5,
    color: theme.text.primary,
  } satisfies TextStyle,
  displaySm: {
    fontSize: fontSize.s11,
    fontWeight: "600",
    lineHeight: 26,
    letterSpacing: -0.42,
    color: theme.text.primary,
  } satisfies TextStyle,
  displayXs: {
    fontSize: fontSize.s10,
    fontWeight: "600",
    lineHeight: 23,
    color: theme.text.primary,
  } satisfies TextStyle,
  sectionTitle: {
    fontSize: fontSize.s7,
    fontWeight: "700",
    letterSpacing: -0.14,
    color: theme.text.primary,
  } satisfies TextStyle,
  body: {
    fontSize: fontSize.s5,
    lineHeight: 20,
    color: theme.text.secondary,
  } satisfies TextStyle,
  bodySm: {
    fontSize: fontSize.s3,
    lineHeight: 17,
    color: theme.text.secondary,
  } satisfies TextStyle,
  label: {
    fontSize: fontSize.s3,
    fontWeight: "500",
    color: theme.text.secondary,
  } satisfies TextStyle,
  eyebrow: {
    fontSize: fontSize.s1,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    color: theme.text.secondary,
  } satisfies TextStyle,
  data: {
    fontSize: fontSize.s4,
    fontWeight: "500",
    color: theme.text.primary,
  } satisfies TextStyle,
} as const;
