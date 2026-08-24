import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { ScrollView, View } from "react-native";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Header } from "@/components/ui/Header";
import { Loader } from "@/components/ui/Loader";
import { RipplePressable } from "@/components/ui/RipplePressable";
import { Text } from "@/components/ui/Text";
import { useNotificationInbox } from "@/hooks/useNotificationInbox";
import { theme } from "@/style/theme";
import { formatLongDate } from "@/utils/format";

import { styles } from "./style";

export default function InboxScreen() {
  const { t } = useTranslation("notifications");
  const { entries, loading, remove, clear } = useNotificationInbox();

  if (loading) {
    return (
      <Container>
        <Header showBack title={t("inboxTitle")} />
        <Loader />
      </Container>
    );
  }

  return (
    <Container>
      <Header showBack title={t("inboxTitle")} />

      {entries.length === 0 ? (
        <View style={styles.empty}>
          <MaterialCommunityIcons
            name="bell-outline"
            size={34}
            color={theme.illustration.leaf}
          />
          <Text family="display" style={styles.emptyTitle}>
            {t("inboxEmptyTitle")}
          </Text>
          <Text style={styles.hint}>{t("inboxEmptyText")}</Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <Text family="mono" style={styles.listLabel}>
            {t("inboxKeep")}
          </Text>

          {entries.map((entry) => (
            <View key={entry.id} style={styles.row}>
              <View style={styles.rowIcon}>
                <MaterialCommunityIcons
                  name="watering-can-outline"
                  size={20}
                  color={theme.primary.clay}
                />
              </View>

              <View style={styles.rowTexts}>
                <Text style={styles.rowBody}>
                  {t("reminderBody", { count: entry.count })}
                </Text>
                <Text family="mono" style={styles.rowTime}>
                  {formatLongDate(new Date(entry.at))}
                </Text>
              </View>

              <RipplePressable
                onPress={() => remove(entry.id)}
                hitSlop={8}
                style={styles.rowRemove}
                accessibilityRole="button"
                accessibilityLabel={t("inboxRemove")}
              >
                <Feather name="x" size={15} color={theme.text.secondary} />
              </RipplePressable>
            </View>
          ))}

          <Button
            label={t("inboxClear")}
            onPress={clear}
            variant="ghost"
            style={styles.clear}
          />
        </ScrollView>
      )}
    </Container>
  );
}
