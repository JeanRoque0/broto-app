import { useRouter } from "expo-router";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, View } from "react-native";

import { BrotinhoFace } from "@/components/illustrations/BrotinhoArt";
import { RipplePressable } from "@/components/ui/RipplePressable";
import { Text } from "@/components/ui/Text";
import type { PromptRequirement, PromptScope } from "@/constants/chatPrompts";
import { theme } from "@/style/theme";
import { fontSize, type } from "@/style/typography";
import { pickPrompts } from "@/utils/chatPrompts";

type ChatSuggestionsProps = {
  seed: string;
  scopes: PromptScope[];
  count?: number;
  plantId?: string | null;
  plantName?: string | null;
  speciesName?: string | null;
  met?: PromptRequirement[];
  beforeNavigate?: () => void;
};

export function ChatSuggestions({
  seed,
  scopes,
  count = 4,
  plantId,
  plantName,
  speciesName,
  met,
  beforeNavigate,
}: ChatSuggestionsProps) {
  const { t } = useTranslation("chat");
  const { t: tPrompts } = useTranslation("prompts");
  const router = useRouter();

  const prompts = useMemo(
    () =>
      pickPrompts({
        scopes,
        count,
        seed,
        translate: (id) => tPrompts(id),
        plantName,
        speciesName,
        met,
      }),
    [scopes, count, seed, tPrompts, plantName, speciesName, met],
  );

  if (prompts.length === 0) return null;

  function ask(question: string) {
    beforeNavigate?.();
    router.push({
      pathname: "/(app)/brotinho",
      params: { q: question, plantId: plantId ?? undefined },
    });
  }

  return (
    <View style={styles.block}>
      <View style={styles.head}>
        <BrotinhoFace size={24} />
        <Text family="display" style={styles.title}>
          {t("suggestionsEyebrow")}
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
      >
        {prompts.map((prompt) => (
          <RipplePressable
            key={prompt.id}
            onPress={() => ask(prompt.text)}
            style={styles.chip}
            accessibilityRole="button"
          >
            <Text style={styles.chipText}>{prompt.text}</Text>
          </RipplePressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    gap: theme.spacing.s3,
  },
  head: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.s2,
  },
  title: {
    ...type.displayXs,
  },
  row: {
    gap: theme.spacing.s2,
    paddingRight: theme.screenPadding,
  },
  chip: {
    maxWidth: 260,
    paddingVertical: theme.spacing.s3,
    paddingHorizontal: theme.spacing.s4,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.surface.card,
    borderWidth: 1,
    borderColor: theme.functional.line,
  },
  chipText: {
    fontSize: fontSize.s5,
    color: theme.text.primary,
  },
});
