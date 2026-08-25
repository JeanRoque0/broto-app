import { Image } from "expo-image";
import { useTranslation } from "react-i18next";
import { StatusBar, StyleSheet, View, useWindowDimensions } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button } from "@/components/ui/Button";
import { theme } from "@/style/theme";

const MIN_SCALE = 1;
const MAX_SCALE = 6;
const TAP_SCALE = 2.5;

type PhotoReviewProps = {
  uri: string;
  onRetake: () => void;
  onAnalyze: () => void;
};

export function PhotoReview({ uri, onRetake, onAnalyze }: PhotoReviewProps) {
  const { t } = useTranslation("camera");
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();

  const scale = useSharedValue(1);
  const saved = useSharedValue(1);
  const x = useSharedValue(0);
  const y = useSharedValue(0);
  const savedX = useSharedValue(0);
  const savedY = useSharedValue(0);

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

  return (
    <View style={styles.root}>
      <StatusBar hidden />

      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.stage, { width, height }, stageStyle]}>
          <Image
            source={{ uri }}
            style={styles.photo}
            contentFit="contain"
            transition={160}
          />
        </Animated.View>
      </GestureDetector>

      <View
        style={[styles.actions, { paddingBottom: insets.bottom + theme.spacing.s5 }]}
      >
        <Button
          label={t("retake")}
          variant="light"
          onPress={onRetake}
          style={styles.action}
        />
        <Button
          label={t("analyze")}
          onPress={onAnalyze}
          style={styles.action}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.surface.dark,
  },
  stage: {
    alignItems: "center",
    justifyContent: "center",
  },
  photo: {
    width: "100%",
    height: "100%",
  },
  actions: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    gap: theme.spacing.s3,
    paddingHorizontal: theme.screenPadding,
  },
  action: {
    flex: 1,
  },
});
