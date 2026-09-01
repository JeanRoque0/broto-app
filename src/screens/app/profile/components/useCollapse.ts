import {
  Extrapolation,
  interpolate,
  SharedValue,
  useDerivedValue,
} from "react-native-reanimated";

import { theme } from "@/style/theme";

export const COLLAPSE_TRAVEL = 130;
export const AVATAR_BIG = 88;
export const AVATAR_SMALL = 34;
export const HEADER_ROW = 38;
export const HEADER_TOP = theme.spacing.s2;
export const HEADER_GAP = theme.spacing.s3;

export function useCollapseProgress(
  scrollY: SharedValue<number>,
  collapseAt: SharedValue<number>,
) {
  return useDerivedValue(() => {
    if (collapseAt.value <= 0) return 0;

    const linear = interpolate(
      scrollY.value,
      [collapseAt.value - COLLAPSE_TRAVEL, collapseAt.value],
      [0, 1],
      Extrapolation.CLAMP,
    );

    return linear * linear * (3 - 2 * linear);
  });
}
