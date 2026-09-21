import { useTranslation } from "react-i18next";
import { Pressable, View } from "react-native";
import Animated from "react-native-reanimated";

import { LanguageButton } from "@/components/LanguageButton";
import { Button } from "@/components/ui/Button";
import { StepDots } from "@/components/ui/ProgressBar";
import { Container } from "@/components/ui/Container";
import { Text } from "@/components/ui/Text";

import { SlideView } from "./components/SlideView";
import { styles } from "./style";
import { useOnboarding } from "./useOnboarding";

export default function OnboardingScreen() {
  const { t } = useTranslation("onboarding");
  const {
    slides,
    scrollRef,
    scrollX,
    index,
    width,
    setWidth,
    isLast,
    handleNext,
    handleScroll,
    handleSkip,
  } = useOnboarding();

  return (
    <Container style={styles.container}>
      <View style={styles.topbar}>
        <LanguageButton />

        <Pressable onPress={handleSkip} hitSlop={12} accessibilityRole="button">
          <Text style={styles.skip}>{t("skip")}</Text>
        </Pressable>
      </View>

      <Animated.ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        onLayout={(event) => setWidth(event.nativeEvent.layout.width)}
      >
        {slides.map((slide, position) => (
          <SlideView
            key={slide.key}
            art={slide.art}
            title={t(`${slide.key}Title` as const)}
            description={t(`${slide.key}Description` as const)}
            index={position}
            width={width}
            scrollX={scrollX}
          />
        ))}
      </Animated.ScrollView>

      <View style={styles.footer}>
        <StepDots total={slides.length} current={index + 1} />

        <Button
          label={isLast ? t("start") : t("continue")}
          onPress={handleNext}
        />
      </View>
    </Container>
  );
}
