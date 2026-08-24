import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { theme } from "@/style/theme";
import { fontSize } from "@/style/typography";

import { Text } from "./Text";

const ENTER_OFFSET = -24;

export type ToastShowParams = {
  text: string;
  subtitle?: string;
  duration?: number;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  subtitleStyle?: StyleProp<TextStyle>;
};

type ToastRef = { show: (params: ToastShowParams) => void };

const _ref: { current: ToastRef | null } = { current: null };

export function ToastContainer() {
  const insets = useSafeAreaInsets();
  const [visible, setVisible] = useState(false);
  const [params, setParams] = useState<ToastShowParams | null>(null);
  const progress = useRef(new Animated.Value(0)).current;
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = useCallback(
    (p: ToastShowParams) => {
      if (timer.current) clearTimeout(timer.current);
      setParams(p);
      setVisible(true);
      progress.stopAnimation();
      progress.setValue(0);

      Animated.spring(progress, {
        toValue: 1,
        useNativeDriver: true,
        isInteraction: false,
        bounciness: 4,
        speed: 16,
      }).start(({ finished }) => {
        if (!finished) return;
        timer.current = setTimeout(() => {
          Animated.timing(progress, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
            isInteraction: false,
          }).start(({ finished: done }) => {
            if (done) setVisible(false);
          });
        }, p.duration ?? 3000);
      });
    },
    [progress],
  );

  useEffect(() => {
    _ref.current = { show };
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [show]);

  if (!visible) return null;

  return (
    <View
      pointerEvents="none"
      style={[styles.overlay, { paddingTop: insets.top + theme.spacing.s2 }]}
    >
      <Animated.View
        style={[
          styles.card,
          params?.style,
          {
            opacity: progress,
            transform: [
              {
                translateY: progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [ENTER_OFFSET, 0],
                }),
              },
            ],
          },
        ]}
      >
        <Text style={[styles.text, params?.textStyle]}>{params?.text}</Text>
        {params?.subtitle ? (
          <Text style={[styles.subtitle, params.subtitleStyle]}>
            {params.subtitle}
          </Text>
        ) : null}
      </Animated.View>
    </View>
  );
}

export const Toast = {
  show: (params: ToastShowParams) => _ref.current?.show(params),
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: theme.spacing.s4,
    zIndex: 9999,
    elevation: 9999,
  },
  card: {
    backgroundColor: theme.text.primary,
    paddingVertical: theme.spacing.s3,
    paddingHorizontal: 20,
    borderRadius: theme.radius.field,
    alignItems: "center",
    maxWidth: "100%",
    gap: 3,
    shadowColor: theme.functional.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.22,
    shadowRadius: 14,
    elevation: 8,
  },
  text: {
    color: theme.text.onDark,
    fontSize: fontSize.s5,
    fontWeight: "700",
    textAlign: "center",
  },
  subtitle: {
    color: theme.functional.white72,
    fontSize: fontSize.s3,
    lineHeight: 17,
    fontWeight: "400",
    textAlign: "center",
  },
});
