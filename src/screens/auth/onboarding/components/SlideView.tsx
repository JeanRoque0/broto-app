import React from "react";
import { View } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
  useReducedMotion,
} from "react-native-reanimated";

import { Text } from "@/components/ui/Text";

import { styles } from "../style";

type SlideViewProps = {
  art: React.ReactNode;
  title: string;
  description: string;
  index: number;
  width: number;
  height: number;
  scrollX: SharedValue<number>;
};

export function SlideView({
  art,
  title,
  description,
  index,
  width,
  height,
  scrollX,
}: SlideViewProps) {
  const reduceMotion = useReducedMotion();

  const artStyle = useAnimatedStyle(() => {
    if (reduceMotion || !width) return {};
    const progress = (scrollX.get() - index * width) / width;
    return {
      opacity: interpolate(
        Math.abs(progress),
        [0, 0.9],
        [1, 0],
        Extrapolation.CLAMP,
      ),
      transform: [
        { translateX: progress * width * 0.45 },
        {
          scale: interpolate(
            Math.abs(progress),
            [0, 1],
            [1, 0.8],
            Extrapolation.CLAMP,
          ),
        },
      ],
    };
  });

  const textStyle = useAnimatedStyle(() => {
    if (reduceMotion || !width) return {};
    const progress = (scrollX.get() - index * width) / width;
    return {
      opacity: interpolate(
        Math.abs(progress),
        [0, 0.5],
        [1, 0],
        Extrapolation.CLAMP,
      ),
      transform: [{ translateY: Math.abs(progress) * 24 }],
    };
  });

  return (
    <View style={[styles.slide, { width, height: height || undefined }]}>
      <Animated.View style={artStyle}>{art}</Animated.View>
      <Animated.View style={[styles.copy, textStyle]}>
        <Text family="display" style={styles.title} accessibilityRole="header">
          {title}
        </Text>
        <Text style={styles.description}>{description}</Text>
      </Animated.View>
    </View>
  );
}
