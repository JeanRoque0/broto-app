import { Feather } from "@expo/vector-icons";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  BackHandler,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { MarkedPhoto } from "@/components/MarkedPhoto";
import { CircleButton } from "@/components/ui/CircleButton";
import { RipplePressable } from "@/components/ui/RipplePressable";
import { Text } from "@/components/ui/Text";
import { theme } from "@/style/theme";
import { fontSize } from "@/style/typography";
import { Diagnosis, SymptomMark } from "@/types/identification";

const MIN_SCALE = 1;
const MAX_SCALE = 6;
const TAP_SCALE = 2.5;
const MOTION = 220;

const FADE_BANDS = 8;
const FADE_HEIGHT = 72;
const FADE_MAX = 0.55;

function PanelFade() {
  return (
    <View style={styles.fade} pointerEvents="none">
      {Array.from({ length: FADE_BANDS }, (unused, band) => (
        <View
          key={band}
          style={{
            height: FADE_HEIGHT / FADE_BANDS,
            backgroundColor: theme.surface.dark,
            opacity: (FADE_MAX * (band + 1)) / FADE_BANDS,
          }}
        />
      ))}
    </View>
  );
}

type ZoomStageProps = {
  uri?: string;
  path?: string | null;
  mark?: SymptomMark | null;
  width: number;
  height: number;
  locked: boolean;
  zoomed: boolean;
  onZoomChange: (zoomed: boolean) => void;
};

function ZoomStage({
  uri,
  path,
  mark,
  width,
  height,
  locked,
  zoomed,
  onZoomChange,
}: ZoomStageProps) {
  const scale = useSharedValue(1);
  const saved = useSharedValue(1);
  const x = useSharedValue(0);
  const y = useSharedValue(0);
  const savedX = useSharedValue(0);
  const savedY = useSharedValue(0);

  function reset() {
    scale.value = withTiming(MIN_SCALE);
    saved.value = MIN_SCALE;
    x.value = withTiming(0);
    y.value = withTiming(0);
    savedX.value = 0;
    savedY.value = 0;
    onZoomChange(false);
  }

  useEffect(() => {
    if (locked && saved.value > MIN_SCALE) reset();
  }, [locked]);

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

  const stageStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: x.value },
      { translateY: y.value },
      { scale: scale.value },
    ],
  }));

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[styles.stage, { width }, stageStyle]}>
        {(uri || path) && (
          <MarkedPhoto
            uri={uri}
            path={path}
            mark={mark}
            fit={{ width, height }}
            style={styles.photo}
          />
        )}
      </Animated.View>
    </GestureDetector>
  );
}

type PhotoZoomProps = {
  visible: boolean;
  uri?: string;
  path?: string | null;
  mark?: SymptomMark | null;
  diagnoses?: Diagnosis[];
  initialIndex?: number;
  onClose: () => void;
  closeLabel: string;
};

export function PhotoZoom({
  visible,
  uri,
  path,
  mark,
  diagnoses,
  initialIndex = 0,
  onClose,
  closeLabel,
}: PhotoZoomProps) {
  const { t } = useTranslation("analysis");
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();

  const pages = diagnoses ?? [];
  const carousel = pages.length > 1;

  const [index, setIndex] = useState(initialIndex);
  const [expanded, setExpanded] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const pager = useRef<ScrollView>(null);

  const dim = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      setIndex(initialIndex);
      setExpanded(false);
      setZoomed(false);
      dim.value = 0;
    }
  }, [visible, initialIndex, dim]);

  useEffect(() => {
    dim.value = withTiming(expanded ? 0.6 : 0, { duration: MOTION });
  }, [expanded, dim]);

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

  function goTo(position: number) {
    pager.current?.scrollTo({ x: position * width, animated: true });
    setIndex(position);
  }

  function onPage(event: NativeSyntheticEvent<NativeScrollEvent>) {
    const next = Math.round(event.nativeEvent.contentOffset.x / width);
    if (next !== index) setIndex(next);
  }

  const dimStyle = useAnimatedStyle(() => ({ opacity: dim.value }));
  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${dim.value * (180 / 0.6)}deg` }],
  }));

  if (!visible) return null;

  const active = pages[index];

  return (
    <Animated.View
      style={styles.root}
      entering={FadeIn.duration(160)}
      exiting={FadeOut.duration(140)}
    >
      <StatusBar hidden />

      {carousel ? (
        <ScrollView
          ref={pager}
          horizontal
          pagingEnabled
          scrollEnabled={!zoomed}
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={onPage}
          contentOffset={{ x: initialIndex * width, y: 0 }}
        >
          {pages.map((item, position) => (
            <ZoomStage
              key={item.causa}
              uri={uri}
              path={path}
              mark={item.marcacao}
              width={width}
              height={height}
              locked={position !== index}
              zoomed={zoomed}
              onZoomChange={setZoomed}
            />
          ))}
        </ScrollView>
      ) : (
        <ZoomStage
          uri={uri}
          path={path}
          mark={active?.marcacao ?? mark}
          width={width}
          height={height}
          locked={false}
          zoomed={zoomed}
          onZoomChange={setZoomed}
        />
      )}

      <Animated.View style={[styles.scrim, dimStyle]} pointerEvents="none" />

      <View
        style={[
          styles.close,
          { top: insets.top + theme.spacing.s3, left: theme.screenPadding },
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

      {active && !zoomed && (
        <Animated.View
          style={[
            styles.panel,
            { paddingBottom: insets.bottom + theme.spacing.s5 },
          ]}
          layout={LinearTransition.duration(MOTION)}
        >
          <PanelFade />

          {carousel && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.stripContent}
              style={styles.strip}
            >
              {pages.map((item, position) => (
                <RipplePressable
                  key={item.causa}
                  onPress={() => goTo(position)}
                  style={[
                    styles.thumb,
                    position === index && styles.thumbActive,
                  ]}
                  accessibilityRole="button"
                  accessibilityState={{ selected: position === index }}
                >
                  <MarkedPhoto
                    uri={uri}
                    path={path}
                    mark={item.marcacao}
                    height={50}
                    style={styles.thumbPhoto}
                  />
                </RipplePressable>
              ))}
            </ScrollView>
          )}

          <RipplePressable
            onPress={() => setExpanded((previous) => !previous)}
            style={styles.panelTouch}
          >
            <View style={styles.panelHead}>
              <Text family="display" style={styles.cause}>
                {active.causa}
              </Text>
              <Animated.View style={chevronStyle}>
                <Feather
                  name="chevron-up"
                  size={18}
                  color={theme.text.onDark}
                />
              </Animated.View>
            </View>

            <Animated.View layout={LinearTransition.duration(MOTION)}>
              {expanded ? (
                <Animated.View
                  key="full"
                  entering={FadeIn.duration(MOTION)}
                  exiting={FadeOut.duration(120)}
                >
                  <ScrollView
                    style={{ maxHeight: height * 0.4 }}
                    showsVerticalScrollIndicator={false}
                  >
                    <Text style={styles.label}>{t("signsLabel")}</Text>
                    <Text style={styles.body}>{active.sinais}</Text>

                    <Text style={[styles.label, styles.labelSpaced]}>
                      {t("actionLabel")}
                    </Text>
                    <Text style={styles.body}>{active.acao}</Text>
                  </ScrollView>
                </Animated.View>
              ) : (
                <Animated.View
                  key="short"
                  entering={FadeIn.duration(MOTION)}
                  exiting={FadeOut.duration(120)}
                >
                  <Text style={styles.body} numberOfLines={3}>
                    {active.sinais}
                  </Text>
                </Animated.View>
              )}
            </Animated.View>
          </RipplePressable>
        </Animated.View>
      )}
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
    alignItems: "center",
    justifyContent: "center",
  },
  photo: {
    borderRadius: 0,
    backgroundColor: "transparent",
  },
  scrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#000000",
  },
  close: {
    position: "absolute",
  },
  panel: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(9, 14, 10, 0.55)",
  },
  fade: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: "100%",
  },
  strip: {
    flexGrow: 0,
    marginBottom: theme.spacing.s3,
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
  thumbPhoto: {
    borderRadius: 0,
    backgroundColor: "transparent",
  },
  panelTouch: {
    paddingHorizontal: theme.screenPadding,
    paddingTop: theme.spacing.s3,
    gap: theme.spacing.s2,
  },
  panelHead: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.spacing.s3,
  },
  cause: {
    flex: 1,
    fontSize: fontSize.s8,
    fontWeight: "600",
    color: theme.text.onDark,
  },
  label: {
    fontSize: fontSize.s2,
    fontWeight: "600",
    letterSpacing: 0.6,
    textTransform: "uppercase",
    color: theme.text.onDark,
    opacity: 0.7,
    marginBottom: theme.spacing.s1,
  },
  labelSpaced: {
    marginTop: theme.spacing.s4,
  },
  body: {
    fontSize: fontSize.s5,
    lineHeight: 21,
    color: theme.text.onDark,
  },
});
