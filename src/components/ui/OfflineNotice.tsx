import { Feather } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
  ReduceMotion,
  SlideInUp,
  SlideOutUp,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Text } from "@/components/ui/Text";
import { useOnline } from "@/hooks/useOnline";
import { theme } from "@/style/theme";
import { fontSize, type } from "@/style/typography";

const MOTION = 260;

export function OfflineNotice() {
  const { t } = useTranslation();
  const online = useOnline();
  const insets = useSafeAreaInsets();

  return (
    <Animated.View
      layout={LinearTransition.duration(MOTION).reduceMotion(
        ReduceMotion.System,
      )}
    >
      {!online && (
        <Animated.View
          entering={SlideInUp.duration(MOTION).reduceMotion(
            ReduceMotion.System,
          )}
          exiting={SlideOutUp.duration(MOTION).reduceMotion(
            ReduceMotion.System,
          )}
          style={[styles.bar, { paddingTop: insets.top + theme.spacing.s2 }]}
          accessibilityRole="alert"
        >
          <Animated.View
            entering={FadeIn.delay(80)
              .duration(MOTION)
              .reduceMotion(ReduceMotion.System)}
            exiting={FadeOut.duration(120).reduceMotion(ReduceMotion.System)}
            style={styles.content}
          >
            <Feather name="cloud-off" size={16} color={theme.text.onPrimary} />

            <View style={styles.texts}>
              <Text style={styles.title}>{t("offlineTitle")}</Text>
              <Text style={styles.body}>{t("offlineText")}</Text>
            </View>
          </Animated.View>
        </Animated.View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  bar: {
    paddingHorizontal: theme.screenPadding,
    paddingBottom: theme.spacing.s3,
    backgroundColor: theme.primary.clay,
  },
  content: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: theme.spacing.s3,
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
