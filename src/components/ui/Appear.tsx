import { ReactNode } from "react";
import { StyleProp, ViewStyle } from "react-native";
import Animated, { FadeInDown, ReduceMotion } from "react-native-reanimated";

const STEP = 60;
const MAX_DELAY = 360;

type AppearProps = {
  index?: number;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function Appear({ index = 0, children, style }: AppearProps) {
  return (
    <Animated.View
      style={style}
      entering={FadeInDown.duration(380)
        .delay(Math.min(index * STEP, MAX_DELAY))
        .springify()
        .damping(18)
        .reduceMotion(ReduceMotion.System)}
    >
      {children}
    </Animated.View>
  );
}
