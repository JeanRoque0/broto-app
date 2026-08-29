import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleProp, StyleSheet, View, ViewStyle } from "react-native";

import { Button } from "@/components/ui/Button";
import { ContainerModalCenter } from "@/components/ui/ContainerModalCenter";
import { RipplePressable } from "@/components/ui/RipplePressable";
import { Text } from "@/components/ui/Text";
import { useAnnouncement } from "@/hooks/useAnnouncement";
import { theme } from "@/style/theme";
import { fontSize, type } from "@/style/typography";

type AnnouncementBannerProps = {
  style?: StyleProp<ViewStyle>;
};

export function AnnouncementBanner({ style }: AnnouncementBannerProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { announcement, title, body, detail, dismiss } = useAnnouncement();

  if (!announcement) return null;

  const price = announcement.kind === "price";

  function openPlans() {
    setOpen(false);
    dismiss();
    router.push("/(app)/paywall");
  }

  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
        style={[styles.container, price && styles.price, style]}
        accessibilityRole="button"
        accessibilityLabel={title}
      >
        <Feather
          name={price ? "tag" : "info"}
          size={18}
          color={price ? theme.primary.clay : theme.secondary.moss}
          style={styles.icon}
        />

        <View style={styles.texts}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.body} numberOfLines={2}>
            {body}
          </Text>
        </View>

        <RipplePressable
          onPress={dismiss}
          style={styles.close}
          accessibilityRole="button"
          accessibilityLabel={t("dismissNotice")}
        >
          <Feather name="x" size={16} color={theme.text.secondary} />
        </RipplePressable>
      </Pressable>

      <ContainerModalCenter
        visible={open}
        onClose={() => setOpen(false)}
        title={title}
        description={detail}
      >
        {price && <Button label={t("noticePlans")} onPress={openPlans} />}
        <Button
          label={price ? t("noticeClose") : t("noticeOk")}
          onPress={() => setOpen(false)}
          variant={price ? "ghost" : "primary"}
        />
      </ContainerModalCenter>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: theme.spacing.s3,
    padding: theme.spacing.s4,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.functional.line,
    backgroundColor: theme.surface.card,
  },
  price: {
    borderColor: theme.primary.clay,
    backgroundColor: theme.primary.claySoft,
  },
  icon: {
    marginTop: 1,
  },
  texts: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: fontSize.s4,
    fontWeight: "700",
    color: theme.text.primary,
  },
  body: {
    ...type.bodySm,
  },
  close: {
    padding: theme.spacing.s1,
    borderRadius: theme.radius.sm,
  },
});
