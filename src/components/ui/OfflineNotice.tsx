import { Feather } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Text } from "@/components/ui/Text";
import { useOnline } from "@/hooks/useOnline";
import { theme } from "@/style/theme";
import { fontSize, type } from "@/style/typography";

const ENTER = 420;
const LEAVE = 340;
const EASE = Easing.bezier(0.22, 1, 0.36, 1);

export function OfflineNotice() {
  const { t } = useTranslation();
  const online = useOnline();
  const insets = useSafeAreaInsets();

  const [height, setHeight] = useState(0);
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(online ? 0 : 1, {
      duration: online ? LEAVE : ENTER,
      easing: EASE,
    });
  }, [online, progress]);

  const shell = useAnimatedStyle(() => ({
    height: height * progress.value,
  }));

  const content = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ translateY: (progress.value - 1) * 12 }],
  }));

  return (
    <Animated.View style={[styles.shell, shell]} pointerEvents="none">
      <Animated.View
        onLayout={(event) => setHeight(event.nativeEvent.layout.height)}
        style={[
          styles.bar,
          { paddingTop: insets.top + theme.spacing.s3 },
          content,
        ]}
        accessibilityRole="alert"
        accessibilityElementsHidden={online}
      >
        <Feather name="cloud-off" size={16} color={theme.text.onPrimary} />

        <View style={styles.texts}>
          <Text style={styles.title}>{t("offlineTitle")}</Text>
          <Text style={styles.body}>{t("offlineText")}</Text>
        </View>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  shell: {
    overflow: "hidden",
  },
  bar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: theme.spacing.s3,
    paddingHorizontal: theme.screenPadding,
    paddingBottom: theme.spacing.s4,
    backgroundColor: theme.primary.clay,
  },
  texts: {
    flex: 1,
    gap: 1,
  },
  title: {
    fontSize: fontSize.s4,
    fontWeight: "700",
    color: theme.text.onPrimary,
  },
  body: {
    ...type.bodySm,
    color: theme.text.onPrimary,
    opacity: 0.9,
  },
});
