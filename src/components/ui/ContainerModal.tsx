import { Feather } from "@expo/vector-icons";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Animated,
  type DimensionValue,
  Keyboard,
  Modal,
  type GestureResponderEvent,
  Platform,
  Pressable,
  ScrollView,
  type ScrollViewProps,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Glass } from "@/components/ui/Glass";
import { Text } from "@/components/ui/Text";
import i18n from "@/i18n";
import { theme } from "@/style/theme";
import { type } from "@/style/typography";

type ModalScrollContextValue = {
  setHasScrollable: (value: boolean) => void;
  onOverscrollY: (amount: number) => void;
  onOverscrollEnd: (amount: number, vy: number) => void;
};

const ModalScrollContext = createContext<ModalScrollContextValue>({
  setHasScrollable: () => {},
  onOverscrollY: () => {},
  onOverscrollEnd: () => {},
});

export function useContainerModalScroll() {
  return useContext(ModalScrollContext);
}

export type ContainerModalProps = {
  visible: boolean;
  onClose: () => void;
  title?: string;
  eyebrow?: string;
  description?: string;
  children?: React.ReactNode;
  maxHeight?: DimensionValue;
  keyboardAware?: boolean;
  showClose?: boolean;
  onShow?: () => void;
};

export function ContainerModal({
  visible,
  onClose,
  title,
  eyebrow,
  description,
  children,
  maxHeight = "80%",
  keyboardAware = false,
  showClose = true,
  onShow,
}: ContainerModalProps) {
  const insets = useSafeAreaInsets();
  const translateY = useState(() => new Animated.Value(300))[0];
  const dismissAnim = useRef<Animated.CompositeAnimation | null>(null);
  const keyboardPadding = useState(() => new Animated.Value(0))[0];
  const onCloseRef = useRef(onClose);

  const [hasScrollable, setHasScrollable] = useState(false);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (visible) {
      dismissAnim.current?.stop();
      dismissAnim.current = null;
      translateY.setValue(300);
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        isInteraction: false,
        bounciness: 0,
        speed: 14,
      }).start();
    } else {
      dismissAnim.current?.stop();
      dismissAnim.current = null;
      translateY.setValue(300);
      keyboardPadding.setValue(0);
    }
  }, [visible, translateY, keyboardPadding]);

  useEffect(() => {
    if (!keyboardAware) return;

    const showEvent =
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent =
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const showSub = Keyboard.addListener(showEvent, (event) => {
      Animated.timing(keyboardPadding, {
        toValue: event.endCoordinates.height,
        duration: Platform.OS === "ios" ? event.duration : 150,
        useNativeDriver: false,
        isInteraction: false,
      }).start();
    });

    const hideSub = Keyboard.addListener(hideEvent, (event) => {
      Animated.timing(keyboardPadding, {
        toValue: 0,
        duration: Platform.OS === "ios" ? event.duration : 150,
        useNativeDriver: false,
        isInteraction: false,
      }).start();
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [keyboardAware, keyboardPadding]);

  const dismiss = useCallback(
    (gesture: { dy: number; vy: number }) => {
      if (gesture.dy > 100 || gesture.vy > 0.5) {
        dismissAnim.current = Animated.timing(translateY, {
          toValue: 600,
          duration: 200,
          useNativeDriver: true,
          isInteraction: false,
        });
        dismissAnim.current.start(({ finished }) => {
          dismissAnim.current = null;
          if (finished) onCloseRef.current();
        });
      } else {
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          isInteraction: false,
          bounciness: 0,
        }).start();
      }
    },
    [translateY],
  );

  const onOverscrollY = useCallback(
    (amount: number) => {
      dismissAnim.current?.stop();
      translateY.setValue(amount);
    },
    [translateY],
  );

  const onOverscrollEnd = useCallback(
    (amount: number, vy: number) => {
      dismiss({ dy: amount, vy });
    },
    [dismiss],
  );

  const drag = useRef({ startY: 0, lastY: 0, lastT: 0, dy: 0, vy: 0 });

  const panHandlers = {
    onStartShouldSetResponder: () => true,
    onResponderGrant: (event: GestureResponderEvent) => {
      const { pageY, timestamp } = event.nativeEvent;
      drag.current = {
        startY: pageY,
        lastY: pageY,
        lastT: timestamp,
        dy: 0,
        vy: 0,
      };
    },
    onResponderMove: (event: GestureResponderEvent) => {
      const { pageY, timestamp } = event.nativeEvent;
      const state = drag.current;
      const elapsed = timestamp - state.lastT;
      state.dy = pageY - state.startY;
      if (elapsed > 0) state.vy = (pageY - state.lastY) / elapsed;
      state.lastY = pageY;
      state.lastT = timestamp;
      if (state.dy > 0) translateY.setValue(state.dy);
    },
    onResponderRelease: () =>
      dismiss({ dy: drag.current.dy, vy: drag.current.vy }),
    onResponderTerminate: () => dismiss({ dy: 0, vy: 0 }),
  };

  const scrollContextValue = useMemo<ModalScrollContextValue>(
    () => ({ setHasScrollable, onOverscrollY, onOverscrollEnd }),
    [setHasScrollable, onOverscrollY, onOverscrollEnd],
  );

  const sheet = (
    <Animated.View
      {...(hasScrollable ? {} : panHandlers)}
      style={[
        styles.sheet,
        { maxHeight, paddingBottom: insets.bottom + theme.spacing.s5 },
        { transform: [{ translateY }] },
      ]}
    >
      <View style={styles.header} {...panHandlers}>
        <View style={styles.grab} />

        {eyebrow && (
          <Text
            family="mono"
            style={[styles.eyebrow, showClose && styles.titleWithClose]}
          >
            {eyebrow}
          </Text>
        )}

        {title && (
          <Text
            accessibilityRole="header"
            family="display"
            style={[styles.title, showClose && styles.titleWithClose]}
          >
            {title}
          </Text>
        )}

        {description && <Text style={styles.description}>{description}</Text>}
      </View>

      {showClose && (
        <Pressable
          style={styles.closeButton}
          onPress={onClose}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel={i18n.t("close")}
        >
          <Feather name="x" size={18} color={theme.text.secondary} />
        </Pressable>
      )}

      <ModalScrollContext.Provider value={scrollContextValue}>
        {children}
      </ModalScrollContext.Provider>
    </Animated.View>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      onShow={onShow}
      statusBarTranslucent
    >
      {keyboardAware ? (
        <Animated.View
          style={[styles.backdrop, { paddingBottom: keyboardPadding }]}
        >
          <Glass tone="dark" intensity={22} style={styles.blur} />
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={onClose}
            accessible={false}
            importantForAccessibility="no"
          />
          {sheet}
        </Animated.View>
      ) : (
        <View style={styles.backdrop}>
          <Glass tone="dark" intensity={22} style={styles.blur} />
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={onClose}
            accessible={false}
            importantForAccessibility="no"
          />
          {sheet}
        </View>
      )}
    </Modal>
  );
}

export function ModalScrollView({
  onScroll,
  onScrollBeginDrag,
  onScrollEndDrag,
  scrollEventThrottle = 16,
  keyboardDismissMode = "on-drag",
  ...props
}: ScrollViewProps) {
  const { setHasScrollable, onOverscrollY, onOverscrollEnd } =
    useContainerModalScroll();
  const isUserDragging = useRef(false);

  useEffect(() => {
    setHasScrollable(true);
    return () => setHasScrollable(false);
  }, [setHasScrollable]);

  return (
    <ScrollView
      {...props}
      style={[styles.modalScroll, props.style]}
      keyboardDismissMode={keyboardDismissMode}
      scrollEventThrottle={scrollEventThrottle}
      onScrollBeginDrag={(event) => {
        isUserDragging.current = true;
        onScrollBeginDrag?.(event);
      }}
      onScrollEndDrag={(event) => {
        isUserDragging.current = false;
        if (Platform.OS === "ios") {
          const y = event.nativeEvent.contentOffset.y;
          if (y < 0) {
            onOverscrollEnd(-y, Math.abs(event.nativeEvent.velocity?.y ?? 0));
          }
        }
        onScrollEndDrag?.(event);
      }}
      onScroll={(event) => {
        if (Platform.OS === "ios" && isUserDragging.current) {
          const y = event.nativeEvent.contentOffset.y;
          if (y < 0) onOverscrollY(-y);
        }
        onScroll?.(event);
      }}
    />
  );
}

const styles = StyleSheet.create({
  modalScroll: {
    flexShrink: 1,
  },
  backdrop: {
    flex: 1,
    justifyContent: "flex-end",
  },
  blur: {
    ...StyleSheet.absoluteFill,
  },
  sheet: {
    backgroundColor: theme.surface.base,
    borderTopLeftRadius: theme.radius.sheet,
    borderTopRightRadius: theme.radius.sheet,
    paddingHorizontal: theme.screenPadding,
    paddingTop: theme.spacing.s3,
    shadowColor: theme.functional.shadow,
    shadowOpacity: 0.12,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: -6 },
    elevation: 16,
  },
  header: {
    gap: theme.spacing.s2,
  },
  grab: {
    width: 38,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: theme.spacing.s4,
    backgroundColor: theme.functional.lineStrong,
  },
  eyebrow: {
    ...type.eyebrow,
  },
  title: {
    ...type.displaySm,
    fontSize: 24,
    lineHeight: 29,
  },
  titleWithClose: {
    paddingRight: 44,
  },
  description: {
    ...type.body,
  },
  closeButton: {
    position: "absolute",
    top: theme.spacing.s5,
    right: theme.spacing.s4,
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.surface.container,
  },
});
