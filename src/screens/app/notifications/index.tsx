import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, View } from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
  ReduceMotion,
} from "react-native-reanimated";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Loader } from "@/components/ui/Loader";
import { Header } from "@/components/ui/Header";
import { RipplePressable } from "@/components/ui/RipplePressable";
import { Text } from "@/components/ui/Text";
import { ToggleSwitch } from "@/components/ui/ToggleSwitch";
import { theme } from "@/style/theme";

import { formatMonth, formatWeekday } from "@/utils/format";

import { styles } from "./style";
import { useNotificationSettings } from "./useNotifications";

const PREVIEW = 3;

export default function NotificationsScreen() {
  const { t } = useTranslation("notifications");
  const {
    enabled,
    blocked,
    upcoming,
    applying,
    toggle,
    openSettings,
  } = useNotificationSettings();

  const [expanded, setExpanded] = useState(false);

  return (
    <Container>
      <Header showBack title={t("title")} />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.subtitle}>{t("subtitle")}</Text>

        {blocked && (
          <View style={styles.blocked}>
            <Text style={styles.blockedTitle}>{t("blockedTitle")}</Text>
            <Text style={styles.hint}>{t("blockedText")}</Text>
            <Button
              label={t("blockedAction")}
              onPress={openSettings}
              variant="outline"
            />
          </View>
        )}

        <RipplePressable
          onPress={toggle}
          style={styles.card}
          accessibilityRole="switch"
          accessibilityState={{ checked: enabled }}
        >
          <View style={styles.texts}>
            <Text style={styles.label}>{t("enabledLabel")}</Text>
            <Text style={styles.hint}>{t("enabledHint")}</Text>
          </View>

          <View
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
          >
            <ToggleSwitch
              value={enabled}
              onToggle={toggle}
              disabled={applying}
            />
          </View>
        </RipplePressable>


        {enabled && applying && (
          <View style={styles.applying}>
            <Loader />
          </View>
        )}

        {enabled && !applying && upcoming.length > 0 && (
          <Animated.View
            style={styles.list}
            layout={LinearTransition.duration(220).reduceMotion(
              ReduceMotion.System,
            )}
          >
            <Text family="mono" style={styles.listLabel}>
              {t("upcomingNext")}
            </Text>

            {(expanded ? upcoming : upcoming.slice(0, PREVIEW)).map((item) => (
              <Animated.View
                key={item.id}
                style={styles.row}
                entering={FadeIn.duration(180).reduceMotion(ReduceMotion.System)}
                exiting={FadeOut.duration(140).reduceMotion(ReduceMotion.System)}
                layout={LinearTransition.duration(220).reduceMotion(
                  ReduceMotion.System,
                )}
              >
                <View style={styles.rowDate}>
                  <Text family="mono" style={styles.rowDay}>
                    {item.at.getDate().toString().padStart(2, "0")}
                  </Text>
                  <Text family="mono" style={styles.rowMonth}>
                    {formatMonth(item.at)}
                  </Text>
                </View>

                <View style={styles.rowTexts}>
                  <Text style={styles.rowTitle} numberOfLines={1}>
                    {item.title}
                  </Text>
                  <Text style={styles.rowBody} numberOfLines={2}>
                    {item.body}
                  </Text>
                  <Text family="mono" style={styles.rowTime}>
                    {formatWeekday(item.at)} ·{" "}
                    {item.at.getHours().toString().padStart(2, "0")}:
                    {item.at.getMinutes().toString().padStart(2, "0")}
                  </Text>
                </View>
              </Animated.View>
            ))}

            {upcoming.length > PREVIEW && (
              <RipplePressable
                onPress={() => setExpanded((open) => !open)}
                style={styles.moreRow}
                accessibilityRole="button"
                accessibilityState={{ expanded }}
              >
                <Text family="mono" style={styles.more}>
                  {expanded
                    ? t("upcomingLess")
                    : t("upcomingMore", { count: upcoming.length - PREVIEW })}
                </Text>

                <Feather
                  name={expanded ? "chevron-up" : "chevron-down"}
                  size={15}
                  color={theme.text.tertiary}
                />
              </RipplePressable>
            )}
          </Animated.View>
        )}

        {enabled && !applying && upcoming.length === 0 && (
          <View style={styles.empty}>
            <MaterialCommunityIcons
              name="bell-sleep-outline"
              size={30}
              color={theme.illustration.leaf}
            />
            <Text family="display" style={styles.emptyTitle}>
              {t("emptyTitle")}
            </Text>
            <Text style={styles.emptyText}>{t("emptyText")}</Text>
          </View>
        )}
      </ScrollView>

    </Container>
  );
}
