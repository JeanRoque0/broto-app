import { Image } from "expo-image";
import { setStatusBarStyle } from "expo-status-bar";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Modal,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ViewerShell } from "@/components/ViewerShell";
import { RipplePressable } from "@/components/ui/RipplePressable";
import i18n from "@/i18n";
import { theme } from "@/style/theme";

const MIN_SCALE = 1;
const MAX_SCALE = 5;
const TAP_SCALE = 2.5;

type GalleryPageProps = {
  uri: string;
  width: number;
  active: boolean;
  zoomed: boolean;
  onZoomChange: (zoomed: boolean) => void;
};

function GalleryPage({
  uri,
  width,
  active,
  zoomed,
  onZoomChange,
}: GalleryPageProps) {
  const scale = useSharedValue(1);
  const saved = useSharedValue(1);
  const x = useSharedValue(0);
  const y = useSharedValue(0);
  const savedX = useSharedValue(0);
  const savedY = useSharedValue(0);

  const reset = useCallback(() => {
    scale.set(withTiming(1));
    saved.set(1);
    x.set(withTiming(0));
    y.set(withTiming(0));
    savedX.set(0);
    savedY.set(0);
    onZoomChange(false);
  }, [scale, saved, x, y, savedX, savedY, onZoomChange]);

  useEffect(() => {
    if (!active && saved.get() > MIN_SCALE) reset();
  }, [active, reset, saved]);

  const gesture = useMemo(() => {
    const pinch = Gesture.Pinch()
      .onUpdate((event) => {
        scale.set(
          Math.min(MAX_SCALE, Math.max(MIN_SCALE, saved.get() * event.scale)),
        );
      })
      .onEnd(() => {
        saved.set(scale.get());
        const isZoomed = scale.get() > MIN_SCALE;

        if (!isZoomed) {
          x.set(withTiming(0));
          y.set(withTiming(0));
          savedX.set(0);
          savedY.set(0);
        }

        runOnJS(onZoomChange)(isZoomed);
      });

    const pan = Gesture.Pan()
      .enabled(zoomed)
      .averageTouches(true)
      .onUpdate((event) => {
        x.set(savedX.get() + event.translationX);
        y.set(savedY.get() + event.translationY);
      })
      .onEnd(() => {
        savedX.set(x.get());
        savedY.set(y.get());
      });

    const doubleTap = Gesture.Tap()
      .numberOfTaps(2)
      .onEnd(() => {
        const next = scale.get() > MIN_SCALE ? MIN_SCALE : TAP_SCALE;
        scale.set(withTiming(next));
        saved.set(next);

        if (next === MIN_SCALE) {
          x.set(withTiming(0));
          y.set(withTiming(0));
          savedX.set(0);
          savedY.set(0);
        }

        runOnJS(onZoomChange)(next > MIN_SCALE);
      });

    return Gesture.Simultaneous(pinch, pan, doubleTap);
  }, [zoomed, onZoomChange, saved, savedX, savedY, scale, x, y]);

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateX: x.get() },
      { translateY: y.get() },
      { scale: scale.get() },
    ],
  }));

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[styles.page, { width }, style]}>
        <Image
          source={{ uri }}
          style={styles.photo}
          contentFit="contain"
          transition={200}
        />
      </Animated.View>
    </GestureDetector>
  );
}

type PhotoGalleryProps = {
  images: string[];
  initialIndex: number;
  visible: boolean;
  onClose: () => void;
  closeLabel: string;
};

export function PhotoGallery({
  images,
  initialIndex,
  visible,
  onClose,
  closeLabel,
}: PhotoGalleryProps) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const [index, setIndex] = useState(initialIndex);
  const [zoomed, setZoomed] = useState(false);
  const pager = useRef<ScrollView>(null);

  const [wasVisible, setWasVisible] = useState(visible);

  if (visible !== wasVisible) {
    setWasVisible(visible);
    if (visible) {
      setIndex(initialIndex);
      setZoomed(false);
    }
  }

  useEffect(() => {
    if (!visible) return;

    setStatusBarStyle("light");

    return () => {
      setStatusBarStyle("dark");
    };
  }, [visible]);

  function onScroll(event: NativeSyntheticEvent<NativeScrollEvent>) {
    setIndex(Math.round(event.nativeEvent.contentOffset.x / width));
  }

  function goTo(position: number) {
    setIndex(position);
    pager.current?.scrollTo({ x: position * width, animated: true });
  }

  const strip =
    images.length > 1 && !zoomed ? (
      <View style={[styles.strip, { bottom: insets.bottom + 20 }]}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.stripContent}
        >
          {images.map((source, position) => (
            <RipplePressable
              key={source}
              onPress={() => goTo(position)}
              style={[styles.thumb, position === index && styles.thumbActive]}
              accessibilityRole="button"
              accessibilityLabel={i18n.t("photoOf", {
                index: position + 1,
                total: images.length,
              })}
              accessibilityState={{ selected: position === index }}
            >
              <Image
                source={{ uri: source }}
                style={styles.thumbImage}
                contentFit="cover"
              />
            </RipplePressable>
          ))}
        </ScrollView>
      </View>
    ) : null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
      navigationBarTranslucent
    >
      <GestureHandlerRootView style={styles.root}>
        <StatusBar hidden />

        <ViewerShell
          onClose={onClose}
          closeLabel={closeLabel}
          counter={
            images.length > 1 ? `${index + 1} / ${images.length}` : undefined
          }
          draggable={!zoomed}
          footer={strip}
        >
          <ScrollView
            ref={pager}
            horizontal
            pagingEnabled
            scrollEnabled={!zoomed}
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={onScroll}
            contentOffset={{ x: initialIndex * width, y: 0 }}
          >
            {images.map((source, position) => (
              <GalleryPage
                key={source}
                uri={source}
                width={width}
                active={position === index}
                zoomed={zoomed}
                onZoomChange={setZoomed}
              />
            ))}
          </ScrollView>
        </ViewerShell>
      </GestureHandlerRootView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  page: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  photo: {
    width: "100%",
    height: "100%",
  },
  strip: {
    position: "absolute",
    left: 0,
    right: 0,
  },
  stripContent: {
    gap: theme.spacing.s2,
    paddingHorizontal: theme.screenPadding,
  },
  thumb: {
    width: 54,
    height: 54,
    borderRadius: theme.radius.field,
    overflow: "hidden",
    opacity: 0.45,
    borderWidth: 2,
    borderColor: "transparent",
  },
  thumbActive: {
    opacity: 1,
    borderColor: theme.text.onDark,
  },
  thumbImage: {
    width: "100%",
    height: "100%",
  },
});
