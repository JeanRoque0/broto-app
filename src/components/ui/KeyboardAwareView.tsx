import React, { useEffect } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleProp,
  ViewStyle,
} from "react-native";
import Animated, {
  useAnimatedKeyboard,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type KeyboardAwareViewProps = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  native?: boolean;
};

export function KeyboardAwareView({
  children,
  style,
  native,
}: KeyboardAwareViewProps) {
  if (Platform.OS === "ios" || native) {
    return (
      <KeyboardAvoidingView style={style} behavior="padding">
        {children}
      </KeyboardAvoidingView>
    );
  }

  return (
    <AndroidKeyboardAwareView style={style}>
      {children}
    </AndroidKeyboardAwareView>
  );
}

function AndroidKeyboardAwareView({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  const keyboard = useAnimatedKeyboard();
  const { bottom } = useSafeAreaInsets();
  const isVisible = useSharedValue(Keyboard.isVisible());

  useEffect(() => {
    const onShow = Keyboard.addListener("keyboardDidShow", () => {
      isVisible.value = true;
    });
    const onHide = Keyboard.addListener("keyboardDidHide", () => {
      isVisible.value = false;
    });

    return () => {
      onShow.remove();
      onHide.remove();
    };
  }, [isVisible]);

  const animatedStyle = useAnimatedStyle(() => ({
    paddingBottom: isVisible.value
      ? Math.max(0, keyboard.height.value - bottom)
      : 0,
  }));

  return (
    <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>
  );
}
