import { Feather } from "@expo/vector-icons";
import { useEffect } from "react";
import {
  BackHandler,
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { MarkedPhoto } from "@/components/MarkedPhoto";
import { CircleButton } from "@/components/ui/CircleButton";
import { theme } from "@/style/theme";
import { SymptomMark } from "@/types/identification";

const MIN_SCALE = 1;
const MAX_SCALE = 6;
const TAP_SCALE = 2.5;

type PhotoZoomProps = {
  visible: boolean;
  uri?: string;
  path?: string | null;
  mark?: SymptomMark | null;
  onClose: () => void;
  closeLabel: string;
};

export function PhotoZoom({
  visible,
  uri,
  path,
  mark,
  onClose,
  closeLabel,
}: PhotoZoomProps) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  const scale = useSharedValue(1);
  const saved = useSharedValue(1);
  const x = useSharedValue(0);
  const y = useSharedValue(0);
  const savedX = useSharedValue(0);
  const savedY = useSharedValue(0);

  useEffect(() => {
    if (visible) return;
    scale.value = 1;
    saved.value = 1;
    x.value = 0;
    y.value = 0;
    savedX.value = 0;
    savedY.value = 0;
  }, [visible, scale, saved, x, y, savedX, savedY]);

  useEffect(() => {
    if (!visible) return;

    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        onClose();
        return true;
      },
    );

    return () => subscription.remove();
  }, [visible, onClose]);

  const pinch = Gesture.Pinch()
    .onUpdate((event) => {
      scale.value = Math.min(
        MAX_SCALE,
        Math.max(MIN_SCALE, saved.value * event.scale),
      );
    })
    .onEnd(() => {
      saved.value = scale.value;
      if (scale.value <= MIN_SCALE) {
        x.value = withTiming(0);
        y.value = withTiming(0);
        savedX.value = 0;
        savedY.value = 0;
      }
    });

  const pan = Gesture.Pan()
    .averageTouches(true)
    .onUpdate((event) => {
      if (scale.value <= MIN_SCALE) return;
      x.value = savedX.value + event.translationX;
      y.value = savedY.value + event.translationY;
    })
    .onEnd(() => {
      savedX.value = x.value;
      savedY.value = y.value;
    });

  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      const next = scale.value > MIN_SCALE ? MIN_SCALE : TAP_SCALE;
      scale.value = withTiming(next);
      saved.value = next;
      if (next === MIN_SCALE) {
        x.value = withTiming(0);
        y.value = withTiming(0);
        savedX.value = 0;
        savedY.value = 0;
      }
    });

  const gesture = Gesture.Simultaneous(pinch, pan, doubleTap);

  const stageStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: x.value },
      { translateY: y.value },
      { scale: scale.value },
    ],
  }));

  if (!visible) return null;

  return (
    <Animated.View
      style={styles.root}
      entering={FadeIn.duration(160)}
      exiting={FadeOut.duration(140)}
    >
      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.stage, stageStyle]}>
          {(uri || path) && (
            <MarkedPhoto uri={uri} path={path} mark={mark} style={{ width }} />
          )}
        </Animated.View>
      </GestureDetector>

      <View
        style={[
          styles.close,
          { top: insets.top + theme.spacing.s3, right: theme.screenPadding },
        ]}
      >
        <CircleButton
          onPress={onClose}
          tone="light"
          accessibilityLabel={closeLabel}
        >
          <Feather name="x" size={18} color={theme.text.onDark} />
        </CircleButton>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 30,
    elevation: 30,
    backgroundColor: theme.surface.dark,
    alignItems: "center",
    justifyContent: "center",
  },
  stage: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  close: {
    position: "absolute",
  },
});
