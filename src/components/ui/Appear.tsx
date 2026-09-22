import { ReactNode } from "react";
import { Platform, StyleProp, View, ViewStyle } from "react-native";
import Animated, {
  Easing,
  FadeInDown,
  ReduceMotion,
} from "react-native-reanimated";

const STEP = 40;
const MAX_DELAY = 200;

type AppearProps = {
  index?: number;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function Appear({ index = 0, children, style }: AppearProps) {
  if (Platform.OS === "web") return <View style={style}>{children}</View>;

  return (
    <Animated.View
      style={style}
      entering={FadeInDown.duration(260)
        .delay(Math.min(index * STEP, MAX_DELAY))
        .easing(Easing.out(Easing.cubic))
        .withInitialValues({ opacity: 0, transform: [{ translateY: 8 }] })
        .reduceMotion(ReduceMotion.System)}
    >
      {children}
    </Animated.View>
  );
}
