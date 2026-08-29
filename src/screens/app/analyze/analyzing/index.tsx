import { Image } from "expo-image";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { MONTH_CAP } from "@/constants";
import { useCredits } from "@/hooks/useProfile";
import { formatOrdinalDate } from "@/utils/format";
import { LayoutChangeEvent, View } from "react-native";
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

import { Container } from "@/components/ui/Container";
import { ErrorState } from "@/components/ui/ErrorState";
import { Text } from "@/components/ui/Text";

import { SCAN_HEIGHT, styles } from "./style";
import { useAnalyzing } from "./useAnalyzing";

const SWEEP = 2200;

const ERROR_STATES = {
  illegible: {
    title: "illegibleTitle",
    text: "illegibleText",
    action: "newPhoto",
  },
  failed: { title: "errorTitle", text: "errorText", action: "retry" },
  dailyCap: {
    title: "dailyCapTitle",
    text: "dailyCapText",
    action: "dailyCapAction",
  },
  monthCap: {
    title: "monthCapTitle",
    text: "monthCapText",
    action: "dailyCapAction",
  },
} as const;

export default function AnalyzingScreen() {
  const { t } = useTranslation("analysis");
  const { phase, photo, sent, total, retry, newPhoto, close } = useAnalyzing();
  const credits = useCredits();
  const [frameHeight, setFrameHeight] = useState(0);
  const offset = useSharedValue(0);

  useEffect(() => {
    if (!frameHeight) return;

    offset.value = 0;
    offset.value = withRepeat(
      withTiming(frameHeight - SCAN_HEIGHT, { duration: SWEEP }),
      -1,
      true,
    );

    return () => cancelAnimation(offset);
  }, [offset, frameHeight]);

  function measureFrame(event: LayoutChangeEvent) {
    setFrameHeight(Math.round(event.nativeEvent.layout.height));
  }

  const scanStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: offset.value }],
  }));

  if (
    phase === "illegible" ||
    phase === "failed" ||
    phase === "dailyCap" ||
    phase === "monthCap"
  ) {
    const state = ERROR_STATES[phase];

    return (
      <Container>
        <View style={styles.container}>
          <ErrorState
            title={t(state.title)}
            description={t(state.text, {
              cap: MONTH_CAP,
              date: formatOrdinalDate(credits.renewsAt),
            })}
            onRetry={
              {
                illegible: newPhoto,
                failed: retry,
                dailyCap: close,
                monthCap: close,
              }[phase]
            }
            retryLabel={t(state.action)}
          />
        </View>
      </Container>
    );
  }

  return (
    <Container>
      <View style={styles.container}>
        <View style={styles.frame} onLayout={measureFrame}>
          {photo && (
            <Image
              source={{ uri: photo }}
              style={styles.photo}
              contentFit="cover"
            />
          )}
          {frameHeight > 0 && (
            <Animated.View style={[styles.scan, scanStyle]} />
          )}
        </View>

        <Text family="display" style={styles.phase}>
          {t(phase === "sending" ? "sendingPhotos" : "reading")}
        </Text>

        <Text style={styles.hint}>{t("wait")}</Text>

        {phase === "sending" && total > 1 && (
          <Text family="mono" style={styles.counter}>
            {sent}/{total}
          </Text>
        )}
      </View>
    </Container>
  );
}
