import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { AccessibilityInfo, ScrollView, View } from "react-native";
import Animated, {
  FadeInDown,
  ReduceMotion,
  FadeIn,
} from "react-native-reanimated";

import { BrotinhoArt } from "@/components/illustrations/BrotinhoArt";
import { Appear } from "@/components/ui/Appear";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Header } from "@/components/ui/Header";
import { RipplePressable } from "@/components/ui/RipplePressable";
import { Text } from "@/components/ui/Text";
import { LanguageCode } from "@/constants/languages";
import { QUIZ, QUIZ_ROUND } from "@/constants/quiz";
import { useBestScore } from "@/hooks/useBestScore";
import { useLanguageStore } from "@/store";
import { theme } from "@/style/theme";
import { haptic } from "@/utils/haptics";

import { QuizProgress } from "./components/QuizProgress";
import { styles } from "./style";

function buildDeck(language: LanguageCode) {
  const list = [...(QUIZ[language] ?? QUIZ["pt-BR"])];

  for (let index = list.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1));
    [list[index], list[swap]] = [list[swap], list[index]];
  }

  return list.slice(0, QUIZ_ROUND);
}

export default function QuizScreen() {
  const { t } = useTranslation("games");
  const language = useLanguageStore((state) => state.current);

  const [deck, setDeck] = useState(() => buildDeck(language));

  const { best, submit } = useBestScore("quiz");

  const [step, setStep] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [hits, setHits] = useState(0);

  const question = deck[step];
  const done = step >= deck.length;

  function pick(index: number) {
    if (picked !== null) return;

    setPicked(index);
    const right = index === question.answer;
    AccessibilityInfo.announceForAccessibility(
      `${t(right ? "quizRight" : "quizWrong")}. ${question.why}`,
    );

    if (right) {
      haptic.success();
      setHits((current) => current + 1);
      setStreak((current) => {
        const next = current + 1;
        setBestStreak((top) => Math.max(top, next));
        return next;
      });
      return;
    }

    haptic.warn();
    setStreak(0);
  }

  function next() {
    setPicked(null);
    const forward = step + 1;
    setStep(forward);
    if (forward >= deck.length) submit(hits);
  }

  function restart() {
    setDeck(buildDeck(language));
    setStep(0);
    setPicked(null);
    setHits(0);
    setStreak(0);
    setBestStreak(0);
  }

  if (done) {
    return (
      <Container>
        <Header showBack title={t("quizTitle")} />

        <View style={styles.over}>
          <Appear index={0}>
            <BrotinhoArt size={128} />
          </Appear>

          <Appear index={1} style={styles.overCopy}>
            <Text
              family="mono"
              style={styles.overScore}
              accessibilityLabel={t("quizScore", {
                hits,
                total: deck.length,
              })}
            >
              {hits}/{deck.length}
            </Text>
            <Text style={styles.overText} accessibilityRole="header">
              {t(hits >= deck.length - 1 ? "quizGreat" : "quizOk")}
            </Text>
          </Appear>

          <Appear index={2} style={styles.overCopy}>
            <Text family="mono" style={styles.streak}>
              {t("quizStreak", { count: bestStreak })}
            </Text>
            <Text family="mono" style={styles.streak}>
              {t("bestScore", { count: best })}
            </Text>
          </Appear>

          <Appear index={3} style={styles.action}>
            <Button label={t("again")} onPress={restart} />
          </Appear>
        </View>
      </Container>
    );
  }

  return (
    <Container>
      <Header showBack title={t("quizTitle")} />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topRow}>
          <Text family="mono" style={styles.progress}>
            {t("quizProgress", { step: step + 1, total: deck.length })}
          </Text>

          {streak > 1 && (
            <Animated.View
              key={streak}
              entering={FadeIn.duration(180).reduceMotion(ReduceMotion.System)}
            >
              <Text family="mono" style={styles.streakChip}>
                {t("combo", { count: streak })}
              </Text>
            </Animated.View>
          )}
        </View>

        <QuizProgress
          step={step + (picked !== null ? 1 : 0)}
          total={deck.length}
          label={t("quizProgress", { step: step + 1, total: deck.length })}
        />

        <View key={step} style={styles.question}>
          <Appear index={0}>
            <Text
              family="display"
              style={styles.ask}
              accessibilityRole="header"
            >
              {question.ask}
            </Text>
          </Appear>

          {question.options.map((option, index) => {
            const right = index === question.answer;
            const chosen = index === picked;
            const reveal = picked !== null;
            const verdict =
              reveal && right
                ? t("quizRight")
                : reveal && chosen
                  ? t("quizWrong")
                  : "";

            return (
              <Appear key={option} index={index + 1}>
                <RipplePressable
                  onPress={() => pick(index)}
                  disabled={reveal}
                  pressScale={0.98}
                  style={[
                    styles.option,
                    reveal && right && styles.optionRight,
                    reveal && chosen && !right && styles.optionWrong,
                    reveal && !right && !chosen && styles.optionMuted,
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel={[option, verdict]
                    .filter(Boolean)
                    .join(". ")}
                  accessibilityState={{ disabled: reveal, selected: chosen }}
                >
                  <Text style={styles.optionText}>{option}</Text>

                  {reveal && (right || chosen) && (
                    <Animated.View
                      entering={FadeIn.duration(180).reduceMotion(
                        ReduceMotion.System,
                      )}
                    >
                      <Feather
                        name={right ? "check" : "x"}
                        size={17}
                        color={
                          right ? theme.secondary.moss : theme.functional.danger
                        }
                      />
                    </Animated.View>
                  )}
                </RipplePressable>
              </Appear>
            );
          })}

          {picked !== null && (
            <Animated.View
              style={styles.why}
              entering={FadeInDown.duration(320).reduceMotion(
                ReduceMotion.System,
              )}
            >
              <Feather name="info" size={16} color={theme.text.secondary} />
              <Text style={styles.whyText}>{question.why}</Text>
            </Animated.View>
          )}
        </View>
      </ScrollView>

      {picked !== null && (
        <Animated.View
          style={styles.footer}
          entering={FadeInDown.duration(260).reduceMotion(ReduceMotion.System)}
        >
          <Button label={t("quizNext")} onPress={next} />
        </Animated.View>
      )}
    </Container>
  );
}
