import { useEffect } from "react";
import { DimensionValue, StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

import i18n from "@/i18n";
import { theme } from "@/style/theme";

type SkeletonProps = {
  width?: DimensionValue;
  height: number;
  radius?: number;
  style?: StyleProp<ViewStyle>;
};

export function Skeleton({
  width = "100%",
  height,
  radius = theme.radius.sm,
  style,
}: SkeletonProps) {
  const reduceMotion = useReducedMotion();
  const glow = useSharedValue(0);

  useEffect(() => {
    if (reduceMotion) {
      cancelAnimation(glow);
      glow.value = 0.5;
      return;
    }

    glow.value = withRepeat(
      withTiming(1, { duration: 900, easing: Easing.inOut(Easing.quad) }),
      -1,
      true,
    );

    return () => cancelAnimation(glow);
  }, [reduceMotion, glow]);

  const pulse = useAnimatedStyle(() => ({
    opacity: 0.45 + glow.value * 0.45,
  }));

  return (
    <Animated.View
      style={[
        styles.block,
        { width, height, borderRadius: radius },
        pulse,
        style,
      ]}
    />
  );
}

export function PlantListSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <View
      style={styles.list}
      accessibilityRole="progressbar"
      accessibilityLabel={i18n.t("loading")}
    >
      {Array.from({ length: rows }, (_, index) => (
        <View key={index} style={styles.row}>
          <Skeleton width={56} height={56} radius={theme.radius.field} />
          <View style={styles.texts}>
            <Skeleton width="62%" height={14} />
            <Skeleton width="38%" height={11} />
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    backgroundColor: theme.surface.containerHighest,
  },
  list: {
    paddingHorizontal: theme.screenPadding,
    paddingTop: theme.spacing.s5,
    gap: theme.spacing.s2,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.s4,
    padding: theme.spacing.s3,
    backgroundColor: theme.surface.card,
    borderWidth: 1,
    borderColor: theme.functional.line,
    borderRadius: theme.radius.md,
  },
  texts: {
    flex: 1,
    gap: theme.spacing.s2,
  },
});
