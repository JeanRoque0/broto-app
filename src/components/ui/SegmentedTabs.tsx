import { ReactNode, useEffect, useRef } from "react";
import {
  LayoutChangeEvent,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import { RipplePressable } from "@/components/ui/RipplePressable";
import { Text } from "@/components/ui/Text";
import { theme } from "@/style/theme";
import { fontSize } from "@/style/typography";

const TRACK_PADDING = 3;

type SegmentedTabsProps<T extends string> = {
  options: { value: T; label: string; icon?: ReactNode }[];
  value: T;
  onChange: (value: T) => void;
  style?: StyleProp<ViewStyle>;
};

export function SegmentedTabs<T extends string>({
  options,
  value,
  onChange,
  style,
}: SegmentedTabsProps<T>) {
  const layouts = useRef<Partial<Record<T, { x: number; width: number }>>>({});
  const pillX = useSharedValue(0);
  const pillWidth = useSharedValue(0);

  useEffect(() => {
    const layout = layouts.current[value];
    if (!layout) return;

    pillX.value = withSpring(layout.x, { damping: 58, stiffness: 300 });
    pillWidth.value = withTiming(layout.width, { duration: 180 });
  }, [value, pillX, pillWidth]);

  const pillStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: pillX.value }],
    width: pillWidth.value,
  }));

  function measure(option: T, event: LayoutChangeEvent) {
    const { x, width } = event.nativeEvent.layout;
    layouts.current[option] = { x, width };

    if (option === value && pillWidth.value === 0) {
      pillX.value = x;
      pillWidth.value = width;
    }
  }

  return (
    <View style={[styles.track, style]}>
      <Animated.View style={[styles.pill, pillStyle]} pointerEvents="none" />

      {options.map((option) => {
        const active = option.value === value;

        return (
          <RipplePressable
            key={option.value}
            onPress={() => onChange(option.value)}
            onLayout={(event) => measure(option.value, event)}
            style={styles.segment}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
          >
            <View style={styles.inner}>
              {option.icon}
              <Text style={[styles.label, active && styles.labelActive]}>
                {option.label}
              </Text>
            </View>
          </RipplePressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: "row",
    marginHorizontal: theme.screenPadding,
    padding: TRACK_PADDING,
    backgroundColor: theme.surface.container,
    borderRadius: theme.radius.button,
  },
  pill: {
    position: "absolute",
    top: TRACK_PADDING,
    bottom: TRACK_PADDING,
    left: 0,
    backgroundColor: theme.surface.card,
    borderRadius: theme.radius.field,
  },
  segment: {
    flex: 1,
    alignItems: "center",
    paddingVertical: theme.spacing.s3,
    borderRadius: theme.radius.field,
  },
  inner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  label: {
    fontSize: fontSize.s6,
    color: theme.text.secondary,
  },
  labelActive: {
    fontWeight: "700",
    color: theme.text.primary,
  },
});
