import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { ScrollView, View } from "react-native";

import { Container } from "@/components/ui/Container";
import { Header } from "@/components/ui/Header";
import { Loader } from "@/components/ui/Loader";
import { RipplePressable } from "@/components/ui/RipplePressable";
import { Text } from "@/components/ui/Text";
import { useNotificationInbox } from "@/hooks/useNotificationInbox";
import { LogEntry, LogKind } from "@/services/notificationLog";
import { theme } from "@/style/theme";
import { formatLongDate } from "@/utils/format";

import { styles } from "./style";

const ICONS: Record<
  LogKind,
  React.ComponentProps<typeof MaterialCommunityIcons>["name"]
> = {
  care: "watering-can-outline",
  late: "alert-circle-outline",
  chat: "chat-outline",
};

export default function InboxScreen() {
  const { t } = useTranslation("notifications");
  const router = useRouter();
  const { entries, loading } = useNotificationInbox();

  function open(entry: LogEntry) {
    if (entry.kind === "chat") {
      router.push("/(app)/(tabs)/chat");
      return;
    }

    if (entry.plantId) router.push(`/(app)/plant/${entry.plantId}`);
  }

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

          {entries.map((entry) => {
            const late = entry.kind === "late";

            return (
              <RipplePressable
                key={entry.id}
                onPress={() => open(entry)}
                style={styles.row}
                accessibilityRole="button"
                accessibilityLabel={`${entry.title}: ${entry.body}`}
              >
                <View style={[styles.rowIcon, late && styles.rowIconLate]}>
                  <MaterialCommunityIcons
                    name={ICONS[entry.kind]}
                    size={20}
                    color={late ? theme.functional.danger : theme.primary.clay}
                  />
                </View>

                <View style={styles.rowTexts}>
                  <View style={styles.rowHead}>
                    {!entry.read && <View style={styles.dot} />}
                    <Text style={styles.rowTitle} numberOfLines={1}>
                      {entry.title}
                    </Text>
                  </View>

                  <Text style={styles.rowBody}>{entry.body}</Text>

                  <Text family="mono" style={styles.rowTime}>
                    {formatLongDate(new Date(entry.at))}
                  </Text>
                </View>

                <Feather
                  name="chevron-right"
                  size={17}
                  color={theme.text.secondary}
                />
              </RipplePressable>
            );
          })}
        </ScrollView>
      )}
    </Container>
  );
}
