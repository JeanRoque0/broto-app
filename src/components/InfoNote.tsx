import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";

import { Text } from "@/components/ui/Text";
import { theme } from "@/style/theme";
import { type } from "@/style/typography";

type InfoNoteProps = {
  icon: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  tone: "moss" | "ochre";
  text: string;
};

const TONES = {
  moss: { bg: theme.secondary.mossSoft, fg: theme.secondary.moss },
  ochre: { bg: theme.secondary.ochreSoft, fg: theme.secondary.ochre },
};

export function InfoNote({ icon, tone, text }: InfoNoteProps) {
  const palette = TONES[tone];

  return (
    <View style={[styles.card, { backgroundColor: palette.bg }]}>
      <View style={styles.icon}>
        <MaterialCommunityIcons name={icon} size={18} color={palette.fg} />
      </View>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: theme.spacing.s3,
    marginTop: theme.spacing.s3,
    padding: theme.spacing.s4,
    borderRadius: theme.radius.lg,
  },
  icon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.surface.card,
  },
  text: {
    ...type.body,
    flex: 1,
    color: theme.text.primary,
  },
});
