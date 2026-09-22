import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  AccessibilityInfo,
  BackHandler,
  LayoutChangeEvent,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import Animated, {
  Easing,
  FadeIn,
  FadeOut,
  ReduceMotion,
  useAnimatedProps,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";

import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";
import { theme } from "@/style/theme";
import { fontSize, type } from "@/style/typography";
import { haptic } from "@/utils/haptics";

import { measureAnchor, Rect } from "./registry";
import { useTourStore } from "./tourStore";

const AnimatedPath = Animated.createAnimatedComponent(Path);

const PAD = 8;
const GAP = 14;
const EDGE = 16;
const MOVE = 420;
const REVEAL_SETTLE = 450;
const CARD_ROOM = 240;

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

type Placement = { top?: number; bottom?: number };

export function TourOverlay() {
  const { t } = useTranslation("tour");
  const id = useTourStore((state) => state.id);
  const steps = useTourStore((state) => state.steps);
  const index = useTourStore((state) => state.index);
  const next = useTourStore((state) => state.next);
  const finish = useTourStore((state) => state.finish);
  const reduceMotion = useReducedMotion();

  const layer = useRef<View>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [placement, setPlacement] = useState<Placement | null>(null);

  const x = useSharedValue(0);
  const y = useSharedValue(0);
  const w = useSharedValue(0);
  const h = useSharedValue(0);
  const width = useSharedValue(0);
  const height = useSharedValue(0);

  const step = id ? steps[index] : null;
  const [placedStep, setPlacedStep] = useState(step);

  if (step !== placedStep) {
    setPlacedStep(step);
    setPlacement(null);
  }

  const origin = useCallback(
    () =>
      new Promise<{ x: number; y: number }>((resolve) => {
        if (!layer.current) return resolve({ x: 0, y: 0 });
        layer.current.measureInWindow((ox, oy) => resolve({ x: ox, y: oy }));
      }),
    [],
  );

  const place = useCallback(
    (rect: Rect, frame: { width: number; height: number }) => {
      const top = rect.y + rect.height + PAD + GAP;
      const bottom = frame.height - rect.y + PAD + GAP;
      const roomBelow = frame.height - top;
      const roomAbove = frame.height - bottom;

      if (roomBelow >= CARD_ROOM && roomBelow >= roomAbove) {
        setPlacement({ top });
      } else if (roomAbove >= CARD_ROOM) {
        setPlacement({ bottom });
      } else if (roomBelow >= CARD_ROOM) {
        setPlacement({ top });
      } else {
        setPlacement({ bottom: EDGE * 2 });
      }
    },
    [],
  );

  useEffect(() => {
    if (!step) return;

    let alive = true;

    async function locate(attempt = 0): Promise<void> {
      if (attempt === 0 && step!.reveal) {
        step!.reveal();
        await wait(REVEAL_SETTLE);
        if (!alive) return;
      }

      const rect = await measureAnchor(step!.anchor);
      if (!alive) return;

      if (!rect) {
        if (attempt < 4) {
          setTimeout(() => locate(attempt + 1), 150);
          return;
        }
        next();
        return;
      }

      const start = await origin();
      const local = {
        x: rect.x - start.x,
        y: rect.y - start.y,
        width: rect.width,
        height: rect.height,
      };

      const offscreen =
        size.height > 0 &&
        (local.y + local.height < 0 || local.y > size.height);

      if (offscreen) {
        next();
        return;
      }

      const target = {
        x: local.x - PAD,
        y: local.y - PAD,
        w: local.width + PAD * 2,
        h: local.height + PAD * 2,
      };

      const timing = {
        duration: reduceMotion || w.get() === 0 ? 0 : MOVE,
        easing: Easing.bezier(0.22, 1, 0.36, 1),
      };

      x.set(withTiming(target.x, timing));
      y.set(withTiming(target.y, timing));
      w.set(withTiming(target.w, timing));
      h.set(withTiming(target.h, timing));

      place(local, size);
      AccessibilityInfo.announceForAccessibility(
        `${step!.title}. ${step!.body}`,
      );
    }

    locate();

    return () => {
      alive = false;
    };
  }, [step, next, origin, place, reduceMotion, size, w, x, y, h]);

  useEffect(() => {
    if (!id) return;

    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        finish();
        return true;
      },
    );

    return () => subscription.remove();
  }, [id, finish]);

  useEffect(() => {
    if (!id) {
      x.set(0);
      y.set(0);
      w.set(0);
      h.set(0);
    }
  }, [id, x, y, w, h]);

  const hole = useAnimatedProps(() => {
    const r = Math.min(18, h.get() / 2, w.get() / 2);
    const left = x.get();
    const top = y.get();
    const right = left + w.get();
    const bottom = top + h.get();

    return {
      d:
        `M0 0 H${width.get()} V${height.get()} H0 Z ` +
        `M${left + r} ${top} H${right - r} ` +
        `A${r} ${r} 0 0 1 ${right} ${top + r} V${bottom - r} ` +
        `A${r} ${r} 0 0 1 ${right - r} ${bottom} H${left + r} ` +
        `A${r} ${r} 0 0 1 ${left} ${bottom - r} V${top + r} ` +
        `A${r} ${r} 0 0 1 ${left + r} ${top} Z`,
    };
  });

  const ring = useAnimatedStyle(() => ({
    left: x.get(),
    top: y.get(),
    width: w.get(),
    height: h.get(),
    borderRadius: Math.min(18, h.get() / 2, w.get() / 2),
  }));

  function handleLayout(event: LayoutChangeEvent) {
    const frame = event.nativeEvent.layout;
    setSize({ width: frame.width, height: frame.height });
    width.set(frame.width);
    height.set(frame.height);
  }

  function advance() {
    haptic.select();
    next();
  }

  if (!id || !step) return null;

  const last = index === steps.length - 1;

  return (
    <View
      ref={layer}
      style={StyleSheet.absoluteFill}
      onLayout={handleLayout}
      accessibilityViewIsModal
      onAccessibilityEscape={finish}
    >
      <Animated.View
        style={StyleSheet.absoluteFill}
        entering={FadeIn.duration(220).reduceMotion(ReduceMotion.System)}
        exiting={FadeOut.duration(180).reduceMotion(ReduceMotion.System)}
      >
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={advance}
          accessible={false}
          importantForAccessibility="no"
        >
          <Svg width={size.width} height={size.height}>
            <AnimatedPath
              animatedProps={hole}
              fill={theme.surface.scrim}
              fillRule="evenodd"
            />
          </Svg>
        </Pressable>

        <Animated.View pointerEvents="none" style={[styles.ring, ring]} />
      </Animated.View>

      {placement && (
        <Animated.View
          key={index}
          style={[styles.card, placement]}
          entering={FadeIn.duration(260).reduceMotion(ReduceMotion.System)}
          accessibilityLiveRegion="polite"
        >
          {steps.length > 1 && (
            <Text family="mono" style={styles.count}>
              {t("count", { step: index + 1, total: steps.length })}
            </Text>
          )}
          <Text
            family="display"
            style={styles.title}
            accessibilityRole="header"
          >
            {step.title}
          </Text>
          <Text style={styles.body}>{step.body}</Text>

          <View style={styles.actions}>
            {!last && (
              <Button
                label={t("skip")}
                onPress={finish}
                variant="ghost"
                size="sm"
                fullWidth={false}
              />
            )}
            <Button
              label={last ? t("done") : t("next")}
              onPress={advance}
              size="sm"
              fullWidth={false}
            />
          </View>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  ring: {
    position: "absolute",
    borderWidth: 2,
    borderColor: theme.primary.claySoft,
  },
  card: {
    position: "absolute",
    left: EDGE,
    right: EDGE,
    padding: theme.spacing.s5,
    gap: theme.spacing.s2,
    backgroundColor: theme.surface.card,
    borderRadius: theme.radius.lg,
    shadowColor: theme.functional.shadow,
    shadowOpacity: 0.18,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 10 },
    elevation: 12,
  },
  count: {
    fontSize: fontSize.s2,
    letterSpacing: 0.8,
    textTransform: "uppercase",
    color: theme.primary.clay,
  },
  title: {
    ...type.displaySm,
  },
  body: {
    ...type.body,
    color: theme.text.secondary,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: theme.spacing.s2,
    marginTop: theme.spacing.s3,
  },
});
