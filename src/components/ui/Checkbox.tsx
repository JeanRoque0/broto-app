import { MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import { Animated, Easing, StyleProp, StyleSheet, ViewStyle } from "react-native";

import { RipplePressable } from "@/components/ui/RipplePressable";
import { theme } from "@/style/theme";

type CheckboxProps = {
  value: boolean;
  onChange: (value: boolean) => void;
  style?: StyleProp<ViewStyle>;
};

export function Checkbox({ value, onChange, style }: CheckboxProps) {
  const bgAnim = useRef(new Animated.Value(value ? 1 : 0)).current;
  const checkScale = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(bgAnim, {
        toValue: value ? 1 : 0,
        duration: 180,
        easing: Easing.out(Easing.quad),
        useNativeDriver: false,
        isInteraction: false,
      }),
      value
        ? Animated.spring(checkScale, {
            toValue: 1,
            useNativeDriver: true,
            isInteraction: false,
            bounciness: 10,
            speed: 18,
          })
        : Animated.timing(checkScale, {
            toValue: 0,
            duration: 120,
            easing: Easing.in(Easing.quad),
            useNativeDriver: true,
            isInteraction: false,
          }),
    ]).start();
  }, [value, bgAnim, checkScale]);

  const backgroundColor = bgAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [theme.surface.card, theme.primary.clay],
  });

  const borderColor = bgAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [theme.functional.line, theme.primary.clay],
  });

  return (
    <RipplePressable
      onPress={() => onChange(!value)}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: value }}
      hitSlop={8}
      borderless
      radius={20}
      style={[styles.press, style]}
    >
      <Animated.View style={[styles.box, { backgroundColor, borderColor }]}>
        <Animated.View style={{ transform: [{ scale: checkScale }] }}>
          <MaterialIcons name="check" size={14} color={theme.text.onPrimary} />
        </Animated.View>
      </Animated.View>
    </RipplePressable>
  );
}

const styles = StyleSheet.create({
  press: {
    alignSelf: "flex-start",
  },
  box: {
    width: 22,
    height: 22,
    borderRadius: 7,
    borderWidth: 1.6,
    alignItems: "center",
    justifyContent: "center",
  },
});
