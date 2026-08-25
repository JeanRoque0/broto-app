import { Image } from "expo-image";
import { useState } from "react";
import { LayoutChangeEvent, StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import Svg, { Circle } from "react-native-svg";

import { RipplePressable } from "@/components/ui/RipplePressable";
import { usePhotoUrl } from "@/hooks/usePhotoUrl";
import { theme } from "@/style/theme";
import { SymptomMark } from "@/types/identification";

type MarkedPhotoProps = {
  uri?: string;
  path?: string | null;
  mark?: SymptomMark | null;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  height?: number;
  fit?: { width: number; height: number };
  accessibilityLabel?: string;
};

function coverSpot(
  mark: SymptomMark | null | undefined,
  frameWidth: number,
  frameHeight: number,
  ratio: number,
) {
  if (!mark || frameWidth <= 0 || frameHeight <= 0) {
    return { cx: 0, cy: 0, r: 0 };
  }

  const frameRatio = frameWidth / frameHeight;

  const drawWidth =
    ratio > frameRatio ? frameHeight * ratio : frameWidth;
  const drawHeight =
    ratio > frameRatio ? frameHeight : frameWidth / ratio;

  return {
    cx: (frameWidth - drawWidth) / 2 + mark.x * drawWidth,
    cy: (frameHeight - drawHeight) / 2 + mark.y * drawHeight,
    r: mark.raio * drawWidth,
  };
}

export function MarkedPhoto({
  uri,
  path,
  mark,
  onPress,
  style,
  height: fixedHeight,
  fit,
  accessibilityLabel,
}: MarkedPhotoProps) {
  const { data: signed } = usePhotoUrl(uri ? null : path);
  const source = uri ?? signed;
  const [ratio, setRatio] = useState(4 / 3);
  const [measured, setMeasured] = useState(0);

  function handleLayout(event: LayoutChangeEvent) {
    setMeasured(event.nativeEvent.layout.width);
  }

  const fitted = fit
    ? Math.min(fit.width, fit.height * ratio)
    : null;

  const width = fitted ?? measured;
  const height = fitted ? fitted / ratio : (fixedHeight ?? measured / ratio);
  const Wrapper = onPress ? RipplePressable : View;

  const spot = coverSpot(mark, width, height, ratio);

  return (
    <Wrapper
      onPress={onPress}
      onLayout={handleLayout}
      style={[
        styles.frame,
        fitted
          ? { width: fitted, height: fitted / ratio, alignSelf: "center" }
          : fixedHeight
            ? { height: fixedHeight }
            : { aspectRatio: ratio },
        style,
      ]}
      accessibilityRole={onPress ? "imagebutton" : undefined}
      accessibilityLabel={accessibilityLabel}
    >
      {source && (
      <Image
        source={{ uri: source }}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        onLoad={(event) => {
          const { width: w, height: h } = event.source;
          if (w && h) setRatio(w / h);
        }}
      />
      )}

      {mark && width > 0 && height > 0 && (
        <Svg style={StyleSheet.absoluteFill} width={width} height={height}>
          <Circle
            cx={spot.cx}
            cy={spot.cy}
            r={spot.r}
            fill={theme.primary.clay}
            fillOpacity={0.14}
          />
          <Circle
            cx={spot.cx}
            cy={spot.cy}
            r={spot.r}
            stroke={theme.primary.clay}
            strokeWidth={3}
            fill="none"
          />
        </Svg>
      )}
    </Wrapper>
  );
}

const styles = StyleSheet.create({
  frame: {
    width: "100%",
    borderRadius: theme.radius.field,
    overflow: "hidden",
    backgroundColor: theme.surface.container,
  },
});
