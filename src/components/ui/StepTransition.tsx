import React, { useEffect, useRef } from "react";
import { Animated, StyleProp, ViewStyle } from "react-native";

const OFFSET = 20;

type StepTransitionProps = {
  stepKey: string;
  direction?: 1 | -1;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function StepTransition({
  stepKey,
  direction = 1,
  children,
  style,
}: StepTransitionProps) {
  const opacity = useRef(new Animated.Value(1)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const previousKey = useRef(stepKey);

  useEffect(() => {
    if (previousKey.current === stepKey) return;
    previousKey.current = stepKey;

    opacity.setValue(0);
    translateX.setValue(direction * OFFSET);

    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 240,
        useNativeDriver: true,
        isInteraction: false,
      }),
      Animated.spring(translateX, {
        toValue: 0,
        useNativeDriver: true,
        isInteraction: false,
        bounciness: 2,
        speed: 14,
      }),
    ]).start();
  }, [stepKey, direction, opacity, translateX]);

  return (
    <Animated.View style={[style, { opacity, transform: [{ translateX }] }]}>
      {children}
    </Animated.View>
  );
}
