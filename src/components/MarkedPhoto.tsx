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
  accessibilityLabel?: string;
};

export function MarkedPhoto({
  uri,
  path,
  mark,
  onPress,
  style,
  height: fixedHeight,
  accessibilityLabel,
}: MarkedPhotoProps) {
  const { data: signed } = usePhotoUrl(uri ? null : path);
  const source = uri ?? signed;
  const [ratio, setRatio] = useState(4 / 3);
  const [width, setWidth] = useState(0);

  function handleLayout(event: LayoutChangeEvent) {
    setWidth(event.nativeEvent.layout.width);
  }

  const height = fixedHeight ?? width / ratio;
  const Wrapper = onPress ? RipplePressable : View;

  return (
    <Wrapper
      onPress={onPress}
      onLayout={handleLayout}
      style={[
        styles.frame,
        fixedHeight
          ? { height: fixedHeight, width: fixedHeight * ratio, alignSelf: "center" }
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

      {mark && width > 0 && (
        <Svg style={StyleSheet.absoluteFill} width={width} height={height}>
          <Circle
            cx={mark.x * width}
            cy={mark.y * height}
            r={mark.raio * width}
            fill={theme.primary.clay}
            fillOpacity={0.14}
          />
          <Circle
            cx={mark.x * width}
            cy={mark.y * height}
            r={mark.raio * width}
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
