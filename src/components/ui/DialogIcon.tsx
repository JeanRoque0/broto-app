import { Feather } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";

import { theme } from "@/style/theme";

type DialogTone = "danger" | "clay" | "moss" | "ochre";

const TONES: Record<DialogTone, { bg: string; fg: string }> = {
  danger: { bg: theme.functional.dangerSoft, fg: theme.functional.danger },
  clay: { bg: theme.primary.claySoft, fg: theme.primary.clay },
  moss: { bg: theme.secondary.mossSoft, fg: theme.secondary.moss },
  ochre: { bg: theme.secondary.ochreSoft, fg: theme.secondary.ochre },
};

type DialogIconProps = {
  name: React.ComponentProps<typeof Feather>["name"];
  tone: DialogTone;
};

export function DialogIcon({ name, tone }: DialogIconProps) {
  const palette = TONES[tone];

  return (
    <View
      style={[styles.ring, { backgroundColor: palette.bg }]}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <Feather name={name} size={24} color={palette.fg} />
    </View>
  );
}

const styles = StyleSheet.create({
  ring: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.spacing.s1,
  },
});
