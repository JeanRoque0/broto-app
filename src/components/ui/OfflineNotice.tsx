import { Feather } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Text } from "@/components/ui/Text";
import { useOnline } from "@/hooks/useOnline";
import { theme } from "@/style/theme";
import { fontSize, type } from "@/style/typography";

export function OfflineNotice() {
  const { t } = useTranslation();
  const online = useOnline();
  const insets = useSafeAreaInsets();

  if (online) return null;

  return (
    <View
      style={[styles.bar, { paddingTop: insets.top + theme.spacing.s2 }]}
      accessibilityRole="alert"
    >
      <Feather name="cloud-off" size={16} color={theme.secondary.ochre} />

      <View style={styles.texts}>
        <Text style={styles.title}>{t("offlineTitle")}</Text>
        <Text style={styles.body}>{t("offlineText")}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: theme.spacing.s3,
    paddingHorizontal: theme.screenPadding,
    paddingBottom: theme.spacing.s3,
    borderBottomWidth: 1,
    borderBottomColor: theme.secondary.ochre,
    backgroundColor: theme.surface.container,
  },
  texts: {
    flex: 1,
    gap: 1,
  },
  title: {
    fontSize: fontSize.s4,
    fontWeight: "700",
    color: theme.text.primary,
  },
  body: {
    ...type.bodySm,
  },
});
