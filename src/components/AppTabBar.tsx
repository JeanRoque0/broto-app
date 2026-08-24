import { MaterialCommunityIcons } from "@expo/vector-icons";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { BottomTabBarHeightCallbackContext } from "@react-navigation/bottom-tabs";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Platform, Pressable, StyleSheet, View } from "react-native";
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { BrotinhoFace } from "@/components/illustrations/BrotinhoArt";
import { useAnalysisStore } from "@/store";
import { theme } from "@/style/theme";
import { fontSize, maxScaleFor } from "@/style/typography";

const TABS = [
  {
    name: "index",
    labelKey: "tabPlants",
    icon: "sprout-outline",
    iconActive: "sprout",
  },
  {
    name: "search",
    labelKey: "tabSearch",
    icon: "magnify",
    iconActive: "magnify",
  },
  {
    name: "analyze",
    labelKey: "tabAnalyze",
    icon: "camera-outline",
    iconActive: "camera",
  },
  {
    name: "chat",
    labelKey: "tabChat",
    icon: "message-outline",
    iconActive: "message",
  },
  {
    name: "profile",
    labelKey: "tabProfile",
    icon: "account-outline",
    iconActive: "account",
  },
] as const satisfies readonly {
  name: string;
  labelKey: string;
  icon: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  iconActive: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
}[];

type TabConfig = (typeof TABS)[number];

const DURATION = 220;
const ICON_SIZE = 22;
const MASCOT_SIZE = 25;

type TabItemProps = {
  config: TabConfig;
  label: string;
  focused: boolean;
  onPress: () => void;
};

function TabItem({ config, label, focused, onPress }: TabItemProps) {
  const progress = useSharedValue(focused ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(focused ? 1 : 0, { duration: DURATION });
  }, [focused, progress]);

  const pillStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ scale: interpolate(progress.value, [0, 1], [0.8, 1]) }],
  }));

  const restingIconStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 1], [1, 0]),
  }));

  const activeIconStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  }));

  const labelStyle = useAnimatedStyle(() => ({
    color: interpolateColor(
      progress.value,
      [0, 1],
      [theme.text.secondary, theme.primary.clay],
    ),
  }));

  return (
    <Pressable
      onPress={onPress}
      style={styles.tab}
      accessibilityRole="tab"
      accessibilityState={{ selected: focused }}
      accessibilityLabel={label}
    >
      <Animated.View style={[styles.pill, pillStyle]} />

      <View style={styles.icon}>
        {config.name === "chat" ? (
          <>
            <Animated.View style={restingIconStyle}>
              <BrotinhoFace size={MASCOT_SIZE} />
            </Animated.View>
            <Animated.View style={activeIconStyle}>
              <BrotinhoFace size={MASCOT_SIZE + 3} />
            </Animated.View>
          </>
        ) : (
          <>
            <Animated.View style={restingIconStyle}>
              <MaterialCommunityIcons
                name={config.icon}
                size={ICON_SIZE}
                color={theme.text.secondary}
              />
            </Animated.View>
            <Animated.View style={activeIconStyle}>
              <MaterialCommunityIcons
                name={config.iconActive}
                size={ICON_SIZE}
                color={theme.primary.clay}
              />
            </Animated.View>
          </>
        )}
      </View>

      <Animated.Text
        style={[styles.label, labelStyle]}
        numberOfLines={1}
        maxFontSizeMultiplier={maxScaleFor(fontSize.s1)}
      >
        {label}
      </Animated.Text>
    </Pressable>
  );
}

export function AppTabBar({ state, navigation }: BottomTabBarProps) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const reportHeight = useContext(BottomTabBarHeightCallbackContext);
  const bottomOffset = Math.max(insets.bottom, theme.spacing.s3);

  return (
    <View
      style={[styles.wrapper, { bottom: bottomOffset }]}
      onLayout={(event) =>
        reportHeight?.(event.nativeEvent.layout.height + bottomOffset)
      }
      pointerEvents="box-none"
    >
      <View style={styles.bar}>
        {state.routes.map((route, index) => {
          const config = TABS.find((tab) => tab.name === route.name);
          if (!config) return null;

          const focused = state.index === index;

          function handlePress() {
            Haptics.selectionAsync();

            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (event.defaultPrevented) return;

            if (route.name === "chat") {
              router.push("/(app)/brotinho");
              return;
            }

            if (route.name === "analyze") {
              useAnalysisStore.getState().reset();
              router.push("/(app)/analyze/camera");
              return;
            }

            if (!focused) navigation.navigate(route.name);
          }

          return (
            <TabItem
              key={route.key}
              config={config}
              label={t(config.labelKey)}
              focused={focused}
              onPress={handlePress}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    left: theme.spacing.s4,
    right: theme.spacing.s4,
  },
  bar: {
    flexDirection: "row",
    alignItems: "stretch",
    padding: theme.spacing.s2,
    gap: theme.spacing.s1,
    backgroundColor: theme.surface.card,
    borderWidth: 1,
    borderColor: theme.functional.line,
    borderRadius: theme.radius.sheet,
    shadowColor: theme.functional.shadow,
    shadowOpacity: 0.12,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 12,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    gap: 3,
    paddingVertical: theme.spacing.s2,
    paddingHorizontal: theme.spacing.s1,
  },
  pill: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.primary.clayTint,
    borderWidth: 1,
    borderColor: theme.primary.clayBorder,
    borderRadius: theme.radius.lg,
  },
  icon: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontFamily: Platform.select({ default: "DMSans_500Medium" }),
    fontSize: fontSize.s1,
    letterSpacing: 0.1,
  },
});
