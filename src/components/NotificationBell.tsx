import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { CircleButton } from "@/components/ui/CircleButton";
import { Text } from "@/components/ui/Text";
import { useUnreadNotifications } from "@/hooks/useNotificationInbox";
import { theme } from "@/style/theme";
import { fontSize } from "@/style/typography";

export function NotificationBell() {
  const { t } = useTranslation("notifications");
  const router = useRouter();
  const unread = useUnreadNotifications();

  return (
    <View>
      <CircleButton
        onPress={() => router.push("/(app)/inbox")}
        accessibilityLabel={t("notificationsBell")}
      >
        <MaterialCommunityIcons
          name={unread > 0 ? "bell-badge-outline" : "bell-outline"}
          size={18}
          color={theme.text.primary}
        />
      </CircleButton>

      {unread > 0 && (
        <View style={styles.badge} pointerEvents="none">
          <Text family="mono" style={styles.count}>
            {unread > 9 ? "9+" : unread}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: "absolute",
    top: -2,
    right: -2,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.primary.clay,
    borderWidth: 1.5,
    borderColor: theme.surface.base,
  },
  count: {
    fontSize: fontSize.s1,
    fontWeight: "700",
    color: theme.text.onPrimary,
  },
});
