import React, { useEffect, useRef, useState } from "react";
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
  const opacity = useState(() => new Animated.Value(1))[0];
  const translateX = useState(() => new Animated.Value(0))[0];
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
        bounciness: 0,
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
