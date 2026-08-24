import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, View } from "react-native";

import { LanguageButton } from "@/components/LanguageButton";
import { Button } from "@/components/ui/Button";
import { StepDots } from "@/components/ui/ProgressBar";
import { Container } from "@/components/ui/Container";
import { Text } from "@/components/ui/Text";

import { styles } from "./style";
import { useOnboarding } from "./useOnboarding";

export default function OnboardingScreen() {
  const { t } = useTranslation("onboarding");
  const {
    slides,
    scrollRef,
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

        <Pressable onPress={handleSkip} hitSlop={12}>
          <Text style={styles.skip}>{t("skip")}</Text>
        </Pressable>
      </View>

      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        onLayout={(event) => setWidth(event.nativeEvent.layout.width)}
      >
        {slides.map((slide) => (
          <View key={slide.key} style={[styles.slide, { width }]}>
            {slide.art}
            <Text family="display" style={styles.title}>
              {t(`${slide.key}Title` as const)}
            </Text>
            <Text style={styles.description}>
              {t(`${slide.key}Description` as const)}
            </Text>
          </View>
        ))}
      </ScrollView>

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
