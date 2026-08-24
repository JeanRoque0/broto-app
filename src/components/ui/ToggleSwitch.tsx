import { useEffect, useRef } from "react";
import { Animated, Pressable, StyleSheet } from "react-native";

import { theme } from "@/style/theme";

type ToggleSwitchProps = {
  value: boolean;
  onToggle: () => void;
  disabled?: boolean;
};

const TRACK_WIDTH = 46;
const TRACK_HEIGHT = 27;
const THUMB_SIZE = 21;
const PADDING = 3;

export function ToggleSwitch({
  value,
  onToggle,
  disabled = false,
}: ToggleSwitchProps) {
  const anim = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
      isInteraction: false,
    }).start();
  }, [value, anim]);

  const backgroundColor = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [theme.surface.muted, theme.secondary.moss],
  });

  const translateX = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [PADDING, TRACK_WIDTH - THUMB_SIZE - PADDING],
  });

  return (
    <Pressable
      onPress={onToggle}
      disabled={disabled}
      hitSlop={8}
      accessibilityRole="switch"
      accessibilityState={{ checked: value, disabled }}
    >
      <Animated.View
        style={[styles.track, disabled && styles.disabled, { backgroundColor }]}
      >
        <Animated.View style={[styles.thumb, { transform: [{ translateX }] }]} />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  track: {
    width: TRACK_WIDTH,
    height: TRACK_HEIGHT,
    borderRadius: theme.radius.pill,
    justifyContent: "center",
  },
  disabled: {
    opacity: 0.5,
  },
  thumb: {
    position: "absolute",
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    backgroundColor: "#FFFFFF",
    shadowColor: theme.functional.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
});
