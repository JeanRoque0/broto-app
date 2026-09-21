import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import Animated, {
  FadeInDown,
  FadeOut,
  ReduceMotion,
} from "react-native-reanimated";

import { RipplePressable } from "@/components/ui/RipplePressable";
import { Text } from "@/components/ui/Text";
import { useCredits } from "@/hooks/useProfile";
import { useOnboardingStore } from "@/store/onboardingStore";
import { theme } from "@/style/theme";
import { fontSize, type } from "@/style/typography";
import { getTrialNotice } from "@/utils/credits";

type TrialBannerProps = {
  style?: StyleProp<ViewStyle>;
};

export function TrialBanner({ style }: TrialBannerProps) {
  const { t } = useTranslation("plants");
  const router = useRouter();
  const credits = useCredits();
  const endedSeen = useOnboardingStore((state) => state.trialEndedSeen);
  const seeEnded = useOnboardingStore((state) => state.seeTrialEnded);
  const notice = getTrialNotice(credits);

  if (!notice || (notice.kind === "ended" && endedSeen)) return null;

  const ended = notice.kind === "ended";
  const title = ended
    ? t("trialEnded")
    : t("trialLeft", { count: notice.daysLeft });
  const text = ended ? t("trialEndedText") : t("trialLeftText");

  return (
    <Animated.View
      style={style}
      entering={FadeInDown.duration(360).reduceMotion(ReduceMotion.System)}
      exiting={FadeOut.duration(200).reduceMotion(ReduceMotion.System)}
    >
      <RipplePressable
        onPress={() => router.push("/(app)/paywall")}
        pressScale={0.98}
        style={[styles.container, ended && styles.ended]}
        accessibilityRole="button"
        accessibilityLabel={`${title}. ${text}`}
        accessibilityHint={t("trialPlans")}
      >
        <MaterialCommunityIcons
          name={ended ? "watering-can-outline" : "sprout-outline"}
          size={20}
          color={ended ? theme.primary.clay : theme.secondary.moss}
        />

        <View style={styles.texts}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.body}>{text}</Text>
          <Text style={styles.action}>{t("trialPlans")}</Text>
        </View>

        {ended && (
          <RipplePressable
            onPress={seeEnded}
            hitSlop={10}
            style={styles.close}
            accessibilityRole="button"
            accessibilityLabel={t("trialDismiss")}
          >
            <Feather name="x" size={16} color={theme.text.secondary} />
          </RipplePressable>
        )}
      </RipplePressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: theme.spacing.s3,
    padding: theme.spacing.s4,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.functional.line,
    backgroundColor: theme.secondary.mossSoft,
  },
  ended: {
    borderColor: theme.primary.clayBorder,
    backgroundColor: theme.primary.clayTint,
  },
  texts: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: fontSize.s5,
    fontWeight: "700",
    color: theme.text.primary,
  },
  body: {
    ...type.bodySm,
  },
  action: {
    marginTop: theme.spacing.s1,
    fontSize: fontSize.s5,
    fontWeight: "700",
    color: theme.primary.clay,
  },
  close: {
    padding: 2,
  },
});
