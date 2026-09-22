import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
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
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { MarkedPhoto } from "@/components/MarkedPhoto";
import { ViewerShell } from "@/components/ViewerShell";
import { Glass } from "@/components/ui/Glass";
import { RipplePressable } from "@/components/ui/RipplePressable";
import { Text } from "@/components/ui/Text";
import { theme } from "@/style/theme";
import { fontSize } from "@/style/typography";
import { Diagnosis, SymptomMark } from "@/types/identification";

const MIN_SCALE = 1;
const MAX_SCALE = 6;
const TAP_SCALE = 2.5;
const MOTION = 220;

const VEIL = [
  "rgba(6, 10, 7, 0)",
  "rgba(6, 10, 7, 0.45)",
  "rgba(6, 10, 7, 0.82)",
  "rgba(6, 10, 7, 0.94)",
] as const;

const VEIL_STOPS = [0, 0.35, 0.72, 1] as const;

type ZoomStageProps = {
  uri?: string;
  path?: string | null;
  mark?: SymptomMark | null;
  width: number;
  height: number;
  active: boolean;
  zoomed: boolean;
  onZoomChange: (zoomed: boolean) => void;
};

function ZoomStage({
  uri,
  path,
  mark,
  width,
  height,
  active,
  zoomed,
  onZoomChange,
}: ZoomStageProps) {
  const scale = useSharedValue(1);
  const saved = useSharedValue(1);
  const x = useSharedValue(0);
  const y = useSharedValue(0);
  const savedX = useSharedValue(0);
  const savedY = useSharedValue(0);

  const reset = useCallback(() => {
    scale.set(withTiming(MIN_SCALE));
    saved.set(MIN_SCALE);
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

  const stageStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: x.get() },
      { translateY: y.get() },
      { scale: scale.get() },
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

type ZoomPanelProps = {
  active: Diagnosis | null;
  pages: Diagnosis[];
  index: number;
  carousel: boolean;
  expanded: boolean;
  onToggle: () => void;
  dim: SharedValue<number>;
  bottom: number;
  maxHeight: number;
};

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
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();

  const pages = diagnoses ?? [];
  const carousel = pages.length > 1;

  const [index, setIndex] = useState(initialIndex);
  const [expanded, setExpanded] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const pager = useRef<ScrollView>(null);

  const dim = useSharedValue(0);

  const [wasVisible, setWasVisible] = useState(visible);

  if (visible !== wasVisible) {
    setWasVisible(visible);
    if (visible) {
      setIndex(initialIndex);
      setExpanded(false);
      setZoomed(false);
    }
  }

  useEffect(() => {
    if (visible) dim.set(0);
  }, [visible, dim]);

  useEffect(() => {
    dim.set(withTiming(expanded ? 0.6 : 0, { duration: MOTION }));
  }, [expanded, dim]);

  function onPage(event: NativeSyntheticEvent<NativeScrollEvent>) {
    const next = Math.round(event.nativeEvent.contentOffset.x / width);
    if (next === index) return;
    setIndex(next);
    setExpanded(false);
  }

  if (!visible) return null;

  const active = pages[index] ?? null;

  const footer = zoomed ? null : (
    <ZoomPanel
      active={active}
      pages={pages}
      index={index}
      carousel={carousel}
      expanded={expanded}
      onToggle={() => setExpanded((previous) => !previous)}
      dim={dim}
      bottom={insets.bottom + theme.spacing.s4}
      maxHeight={height * 0.4}
    />
  );

  return (
    <View style={styles.root}>
      <StatusBar hidden />

      <ViewerShell
        onClose={onClose}
        closeLabel={closeLabel}
        counter={carousel ? `${index + 1} / ${pages.length}` : undefined}
        draggable={!zoomed && !expanded}
        footer={footer}
      >
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
                active={position === index}
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
            active
            zoomed={zoomed}
            onZoomChange={setZoomed}
          />
        )}
      </ViewerShell>
    </View>
  );
}

function ZoomPanel({
  active,
  pages,
  index,
  carousel,
  expanded,
  onToggle,
  dim,
  bottom,
  maxHeight,
}: ZoomPanelProps) {
  const { t } = useTranslation("analysis");
  const dimStyle = useAnimatedStyle(() => ({ opacity: dim.get() }));
  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${dim.get() * (180 / 0.6)}deg` }],
  }));

  return (
    <>
      <Animated.View style={[styles.scrim, dimStyle]} pointerEvents="none" />
      {active && (
        <Animated.View
          style={[styles.panel, { paddingBottom: bottom }]}
          layout={LinearTransition.duration(MOTION)}
        >
          <LinearGradient
            colors={VEIL}
            locations={VEIL_STOPS}
            style={styles.veil}
            pointerEvents="none"
          />

          {carousel && (
            <View style={styles.dots}>
              {pages.map((item, position) => (
                <Animated.View
                  key={item.causa}
                  layout={LinearTransition.duration(MOTION)}
                  style={[styles.dot, position === index && styles.dotActive]}
                />
              ))}
            </View>
          )}

          <Glass tone="dark" intensity={40} style={styles.card}>
            <RipplePressable
              onPress={onToggle}
              style={styles.panelTouch}
              accessibilityRole="button"
              accessibilityState={{ expanded }}
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
                      style={{ maxHeight }}
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
          </Glass>
        </Animated.View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFill,
    zIndex: 30,
    elevation: 30,
  },
  card: {
    marginHorizontal: theme.spacing.s3,
    paddingBottom: theme.spacing.s4,
    borderRadius: theme.radius.lg,
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
    ...StyleSheet.absoluteFill,
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
  },
  veil: {
    position: "absolute",
    left: 0,
    right: 0,
    top: -80,
    bottom: 0,
  },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    gap: theme.spacing.s2,
    paddingBottom: theme.spacing.s3,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: theme.text.onDark,
    opacity: 0.32,
  },
  dotActive: {
    width: 20,
    opacity: 1,
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
