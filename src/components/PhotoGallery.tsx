import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import { setStatusBarStyle } from "expo-status-bar";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  BackHandler,
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

import { CircleButton } from "@/components/ui/CircleButton";
import { RipplePressable } from "@/components/ui/RipplePressable";
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

  function reset() {
    scale.value = withTiming(1);
    saved.value = 1;
    x.value = withTiming(0);
    y.value = withTiming(0);
    savedX.value = 0;
    savedY.value = 0;
    onZoomChange(false);
  }

  useEffect(() => {
    if (!active && saved.value > MIN_SCALE) reset();
  }, [active]);

  const gesture = useMemo(() => {
    const pinch = Gesture.Pinch()
      .onUpdate((event) => {
        scale.value = Math.min(
          MAX_SCALE,
          Math.max(MIN_SCALE, saved.value * event.scale),
        );
      })
      .onEnd(() => {
        saved.value = scale.value;
        const isZoomed = scale.value > MIN_SCALE;

        if (!isZoomed) {
          x.value = withTiming(0);
          y.value = withTiming(0);
          savedX.value = 0;
          savedY.value = 0;
        }

        runOnJS(onZoomChange)(isZoomed);
      });

    const pan = Gesture.Pan()
      .enabled(zoomed)
      .averageTouches(true)
      .onUpdate((event) => {
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

        runOnJS(onZoomChange)(next > MIN_SCALE);
      });

    return Gesture.Simultaneous(pinch, pan, doubleTap);
  }, [zoomed, onZoomChange]);

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateX: x.value },
      { translateY: y.value },
      { scale: scale.value },
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

  useEffect(() => {
    if (visible) {
      setIndex(initialIndex);
      setZoomed(false);
    }
  }, [visible, initialIndex]);

  useEffect(() => {
    if (!visible) return;

    setStatusBarStyle("light");

    const listener = BackHandler.addEventListener("hardwareBackPress", () => {
      onClose();
      return true;
    });

    return () => {
      listener.remove();
      setStatusBarStyle("dark");
    };
  }, [visible, onClose]);

  function onScroll(event: NativeSyntheticEvent<NativeScrollEvent>) {
    setIndex(Math.round(event.nativeEvent.contentOffset.x / width));
  }

  function goTo(position: number) {
    setIndex(position);
    pager.current?.scrollTo({ x: position * width, animated: true });
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
      navigationBarTranslucent
    >
      <GestureHandlerRootView style={styles.root}>
        <StatusBar
          barStyle="light-content"
          backgroundColor="transparent"
          translucent
        />

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

        {images.length > 1 && !zoomed && (
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
                  style={[
                    styles.thumb,
                    position === index && styles.thumbActive,
                  ]}
                  accessibilityRole="button"
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
        )}

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
      </GestureHandlerRootView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.surface.dark,
  },
  page: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  photo: {
    width: "100%",
    height: "72%",
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
  close: {
    position: "absolute",
  },
});
