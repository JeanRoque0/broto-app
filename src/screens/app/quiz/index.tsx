import { Feather } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, View } from "react-native";

import { BrotinhoArt } from "@/components/illustrations/BrotinhoArt";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Header } from "@/components/ui/Header";
import { RipplePressable } from "@/components/ui/RipplePressable";
import { Text } from "@/components/ui/Text";
import { QUIZ, QUIZ_ROUND } from "@/constants/quiz";
import { useBestScore } from "@/hooks/useBestScore";
import { useLanguageStore } from "@/store";
import { theme } from "@/style/theme";

import { styles } from "./style";

export default function QuizScreen() {
  const { t } = useTranslation("games");
  const language = useLanguageStore((state) => state.current);

  const [round, setRound] = useState(0);

  const deck = useMemo(() => {
    const list = [...(QUIZ[language] ?? QUIZ["pt-BR"])];

    for (let index = list.length - 1; index > 0; index -= 1) {
      const swap = Math.floor(Math.random() * (index + 1));
      [list[index], list[swap]] = [list[swap], list[index]];
    }

    return list.slice(0, QUIZ_ROUND);
  }, [language, round]);

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

    if (index === question.answer) {
      setHits((current) => current + 1);
      setStreak((current) => {
        const next = current + 1;
        setBestStreak((top) => Math.max(top, next));
        return next;
      });
      return;
    }

    setStreak(0);
  }

  function next() {
    setPicked(null);
    const forward = step + 1;
    setStep(forward);
    if (forward >= deck.length) submit(hits);
  }

  function restart() {
    setRound((current) => current + 1);
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
          <BrotinhoArt size={128} />

          <Text family="mono" style={styles.overScore}>
            {hits}/{deck.length}
          </Text>
          <Text style={styles.overText}>
            {t(hits >= deck.length - 1 ? "quizGreat" : "quizOk")}
          </Text>

          <Text family="mono" style={styles.streak}>
            {t("quizStreak", { count: bestStreak })}
          </Text>
          <Text family="mono" style={styles.streak}>
            {t("bestScore", { count: best })}
          </Text>

          <Button label={t("again")} onPress={restart} style={styles.action} />
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
            <Text family="mono" style={styles.streakChip}>
              {t("combo", { count: streak })}
            </Text>
          )}
        </View>

        <Text family="display" style={styles.ask}>
          {question.ask}
        </Text>

        {question.options.map((option, index) => {
          const right = index === question.answer;
          const chosen = index === picked;
          const reveal = picked !== null;

          return (
            <RipplePressable
              key={option}
              onPress={() => pick(index)}
              style={[
                styles.option,
                reveal && right && styles.optionRight,
                reveal && chosen && !right && styles.optionWrong,
              ]}
              accessibilityRole="button"
            >
              <Text style={styles.optionText}>{option}</Text>

              {reveal && (right || chosen) && (
                <Feather
                  name={right ? "check" : "x"}
                  size={17}
                  color={right ? theme.secondary.moss : theme.functional.danger}
                />
              )}
            </RipplePressable>
          );
        })}

        {picked !== null && (
          <View style={styles.why}>
            <Text style={styles.whyText}>{question.why}</Text>
          </View>
        )}
      </ScrollView>

      {picked !== null && (
        <View style={styles.footer}>
          <Button label={t("quizNext")} onPress={next} />
        </View>
      )}
    </Container>
  );
}
