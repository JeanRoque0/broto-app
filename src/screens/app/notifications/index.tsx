import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, View } from "react-native";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Loader } from "@/components/ui/Loader";
import { ContainerModal } from "@/components/ui/ContainerModal";
import { Header } from "@/components/ui/Header";
import { RipplePressable } from "@/components/ui/RipplePressable";
import { Text } from "@/components/ui/Text";
import { ToggleSwitch } from "@/components/ui/ToggleSwitch";
import { WheelBand, WheelPicker } from "@/components/ui/WheelPicker";
import { theme } from "@/style/theme";

import { formatMonth, formatWeekday } from "@/utils/format";

import { styles } from "./style";
import { useNotificationSettings } from "./useNotifications";

const HOURS = Array.from({ length: 24 }, (_, index) => ({
  value: index,
  label: String(index).padStart(2, "0"),
}));

const PREVIEW = 3;

const MINUTES = [0, 15, 30, 45].map((value) => ({
  value,
  label: String(value).padStart(2, "0"),
}));

export default function NotificationsScreen() {
  const { t } = useTranslation("notifications");
  const {
    enabled,
    reminderTime,
    blocked,
    scheduled,
    upcoming,
    applying,
    hasTasks,
    toggle,
    saveTime,
    timeVisible,
    openTime,
    closeTime,
    openSettings,
  } = useNotificationSettings();

  const [hour, minute] = reminderTime.slice(0, 5).split(":").map(Number);
  const [draftHour, setDraftHour] = useState(hour);
  const [draftMinute, setDraftMinute] = useState(minute);

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

        {enabled && (
          <RipplePressable
            onPress={() => {
              setDraftHour(hour);
              setDraftMinute(minute);
              openTime();
            }}
            style={styles.card}
            accessibilityRole="button"
          >
            <View style={styles.texts}>
              <Text style={styles.label}>{t("timeLabel")}</Text>
              <Text style={styles.hint}>{t("timeHint")}</Text>
            </View>

            <Text family="mono" style={styles.time}>
              {reminderTime.slice(0, 5)}
            </Text>

            <Feather
              name="chevron-right"
              size={18}
              color={theme.text.secondary}
            />
          </RipplePressable>
        )}

        {enabled && applying && (
          <View style={styles.applying}>
            <Loader />
          </View>
        )}

        {enabled && !applying && upcoming.length > 0 && (
          <View style={styles.list}>
            <Text family="mono" style={styles.listLabel}>
              {t("upcomingNext")}
            </Text>

            {upcoming.slice(0, PREVIEW).map((item) => (
              <View key={item.id} style={styles.row}>
                <View style={styles.rowDate}>
                  <Text family="mono" style={styles.rowDay}>
                    {item.at.getDate().toString().padStart(2, "0")}
                  </Text>
                  <Text family="mono" style={styles.rowMonth}>
                    {formatMonth(item.at)}
                  </Text>
                </View>

                <View style={styles.rowTexts}>
                  <Text style={styles.rowBody} numberOfLines={2}>
                    {item.body}
                  </Text>
                  <Text family="mono" style={styles.rowTime}>
                    {formatWeekday(item.at)} ·{" "}
                    {item.at.getHours().toString().padStart(2, "0")}:
                    {item.at.getMinutes().toString().padStart(2, "0")}
                  </Text>
                </View>
              </View>
            ))}

            {upcoming.length > PREVIEW && (
              <Text family="mono" style={styles.more}>
                {t("upcomingMore", { count: upcoming.length - PREVIEW })}
              </Text>
            )}
          </View>
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
            <Text style={styles.hint}>{t("emptyText")}</Text>
          </View>
        )}
      </ScrollView>

      <ContainerModal
        visible={timeVisible}
        onClose={closeTime}
        title={t("timeLabel")}
        description={t("timeHint")}
      >
        <View style={styles.wheels}>
          <WheelBand />
          <WheelPicker
            items={HOURS}
            value={draftHour}
            onChange={setDraftHour}
          />
          <WheelPicker
            items={MINUTES}
            value={draftMinute}
            onChange={setDraftMinute}
          />
        </View>

        <Button
          label={t("save", { ns: "common" })}
          onPress={() =>
            saveTime(
              `${String(draftHour).padStart(2, "0")}:${String(
                draftMinute,
              ).padStart(2, "0")}`,
            )
          }
          style={styles.action}
        />
      </ContainerModal>
    </Container>
  );
}
