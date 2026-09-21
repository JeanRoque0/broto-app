import { MaterialIcons } from "@expo/vector-icons";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import {
  AccessibilityInfo,
  Pressable,
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import i18n from "@/i18n";
import { theme } from "@/style/theme";
import { fontSize, maxScaleFor, resolveFontFamily } from "@/style/typography";
import { haptic } from "@/utils/haptics";

import { Text } from "./Text";

type InputProps = TextInputProps & {
  label?: string;
  hint?: string;
  error?: string;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  onIconRightPress?: () => void;
  readOnly?: boolean;
  isPassword?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  inputWrapperStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
};

export const Input = forwardRef<TextInput, InputProps>(function Input(
  {
    label,
    hint,
    error,
    iconLeft,
    iconRight,
    onIconRightPress,
    readOnly = false,
    isPassword = false,
    containerStyle,
    inputWrapperStyle,
    inputStyle,
    value,
    ...rest
  },
  ref,
) {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const inputRef = useRef<TextInput>(null);
  useImperativeHandle(ref, () => inputRef.current!, []);

  const hasError = !!error;
  const reduceMotion = useReducedMotion();
  const shake = useSharedValue(0);

  useEffect(() => {
    if (!error) return;
    haptic.warn();
    AccessibilityInfo.announceForAccessibility(error);
    if (reduceMotion) return;
    shake.value = withSequence(
      withTiming(-6, { duration: 50 }),
      withTiming(6, { duration: 70 }),
      withTiming(-4, { duration: 60 }),
      withTiming(0, { duration: 50 }),
    );
  }, [error, reduceMotion, shake]);

  const shakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shake.value }],
  }));

  const resolvedIconRight = isPassword ? (
    <MaterialIcons
      name={showPassword ? "visibility-off" : "visibility"}
      size={20}
      color={theme.text.secondary}
    />
  ) : (
    iconRight
  );

  const resolvedIconRightPress = isPassword
    ? () => setShowPassword((prev) => !prev)
    : onIconRightPress;

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}

      <Animated.View style={shakeStyle}>
        <Pressable
          style={[
            styles.wrapper,
            focused && styles.wrapperFocused,
            readOnly && styles.wrapperReadOnly,
            hasError && styles.wrapperError,
            inputWrapperStyle,
          ]}
          onPress={() => inputRef.current?.focus()}
          accessible={false}
        >
          {iconLeft}

          <TextInput
            ref={inputRef}
            style={[styles.input, readOnly && styles.inputReadOnly, inputStyle]}
            value={value}
            editable={!readOnly}
            maxFontSizeMultiplier={maxScaleFor(fontSize.s6)}
            accessibilityLabel={label}
            accessibilityHint={error ?? hint}
            placeholderTextColor={theme.text.tertiary}
            {...rest}
            secureTextEntry={isPassword ? !showPassword : rest.secureTextEntry}
            onFocus={(e) => {
              setFocused(true);
              rest.onFocus?.(e);
            }}
            onBlur={(e) => {
              setFocused(false);
              rest.onBlur?.(e);
            }}
          />

          {resolvedIconRight && (
            <Pressable
              onPress={resolvedIconRightPress}
              disabled={!resolvedIconRightPress}
              hitSlop={12}
              accessible={!!resolvedIconRightPress}
              accessibilityRole="button"
              accessibilityLabel={
                isPassword
                  ? i18n.t(showPassword ? "hidePassword" : "showPassword")
                  : undefined
              }
            >
              {resolvedIconRight}
            </Pressable>
          )}
        </Pressable>
      </Animated.View>

      {(hint || error) && (
        <Text
          style={[styles.hint, hasError && styles.hintError]}
          importantForAccessibility="no-hide-descendants"
        >
          {error ?? hint}
        </Text>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    gap: 6,
    width: "100%",
  },
  label: {
    fontSize: fontSize.s5,
    fontWeight: "700",
    letterSpacing: -0.14,
    color: theme.text.primary,
  },
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.s3,
    minHeight: 50,
    paddingHorizontal: theme.spacing.s4,
    paddingVertical: theme.spacing.s3,
    backgroundColor: theme.surface.card,
    borderWidth: 1.5,
    borderColor: theme.functional.line,
    borderRadius: theme.radius.field,
  },
  wrapperFocused: {
    borderColor: theme.primary.clay,
    backgroundColor: theme.primary.clayTint,
  },
  wrapperReadOnly: {
    backgroundColor: theme.surface.container,
    borderColor: "transparent",
  },
  wrapperError: {
    borderColor: theme.functional.danger,
  },
  input: {
    flex: 1,
    fontSize: fontSize.s6,
    color: theme.text.primary,
    fontFamily: resolveFontFamily("sans", "400"),
    padding: 0,
    includeFontPadding: false,
  },
  inputReadOnly: {
    color: theme.text.secondary,
  },
  hint: {
    fontSize: fontSize.s2,
    color: theme.text.secondary,
  },
  hintError: {
    color: theme.functional.danger,
  },
});
