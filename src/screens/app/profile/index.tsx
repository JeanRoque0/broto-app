import { Feather } from "@expo/vector-icons";
import Constants from "expo-constants";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, View } from "react-native";

import { withHaptic } from "@/utils/haptics";
import { DialogIcon } from "@/components/ui/DialogIcon";
import { PlantPhoto } from "@/components/PlantPhoto";
import { Appear } from "@/components/ui/Appear";
import { AvatarSheet } from "@/components/AvatarSheet";
import { LanguageSheet } from "@/components/LanguageSheet";
import { useTabBarSpace } from "@/hooks/useTabBarSpace";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { AnnouncementBanner } from "@/components/AnnouncementBanner";
import { CHAT_MONTH_CAP, MONTH_CAP } from "@/constants";
import { Card } from "@/components/ui/Card";
import { QuotaBar } from "@/components/ui/QuotaBar";
import { ContainerModalCenter } from "@/components/ui/ContainerModalCenter";
import { Chip } from "@/components/ui/Chip";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { MenuRow } from "@/components/ui/Row";
import { RipplePressable } from "@/components/ui/RipplePressable";
import { Text } from "@/components/ui/Text";
import { LANGUAGES } from "@/constants/languages";
import { UnitsSheet } from "@/components/UnitsSheet";
import { useTemperatureUnit } from "@/hooks/useTemperatureUnit";
import { useLanguageStore } from "@/store";
import { theme } from "@/style/theme";

import { styles } from "./style";
import { useProfileScreen } from "./useProfileScreen";

export default function ProfileScreen() {
  const { t } = useTranslation("profile");
  const tabBarSpace = useTabBarSpace();
  const currentLanguage = useLanguageStore((state) => state.current);
  const {
    name,
    email,
    initial,
    profile,
    credits,
    planLabel,
    usedLabel,
    renewsLabel,
    signingOut,
    languageVisible,
    openLanguage,
    closeLanguage,
    photoVisible,
    openPhotoSheet,
    closePhotoSheet,
    handleSignOut,
    openEditProfile,
    openPaywall,
    openNotifications,
    openDeleteAccount,
    revokeVisible,
    revoking,
    openRevoke,
    closeRevoke,
    handleRevoke,
    exportData,
    exporting,
    replayTours,
    openTerms,
    openPrivacy,
    openRefund,
    openSupport,
    handleRestorePurchase,
  } = useProfileScreen();

  const { unit } = useTemperatureUnit();
  const version = Constants.expoConfig?.version ?? "—";
  const [unitsVisible, setUnitsVisible] = useState(false);

  const languageLabel = LANGUAGES.find(
    (item) => item.code === currentLanguage,
  )?.label;

  return (
    <Container>
      <View style={styles.header}>
        <Text accessibilityRole="header" family="display" style={styles.title}>
          {t("title")}
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: tabBarSpace }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.identity}>
          <Pressable
            onPress={withHaptic(openPhotoSheet)}
            style={styles.avatarTouch}
            accessibilityRole="button"
            accessibilityLabel={t("editPhoto")}
          >
            <PlantPhoto
              path={profile?.avatar_path ?? null}
              style={styles.avatar}
              fallback={
                <Text family="display" style={styles.avatarLetter}>
                  {initial}
                </Text>
              }
            />
            <View style={styles.avatarBadge}>
              <Feather name="camera" size={12} color={theme.text.onPrimary} />
            </View>
          </Pressable>

          <View style={styles.identityTexts}>
            <Text style={styles.name} numberOfLines={1}>
              {name}
            </Text>
            <Text style={styles.email} numberOfLines={1}>
              {email}
            </Text>
            <RipplePressable
              onPress={openEditProfile}
              style={styles.editLink}
              accessibilityRole="button"
            >
              <Feather name="edit-2" size={13} color={theme.primary.clay} />
              <Text style={styles.editLabel}>{t("editProfile")}</Text>
            </RipplePressable>
          </View>
        </View>

        <Appear index={0}>
          <View style={styles.section}>
            <AnnouncementBanner style={styles.banner} />

            <Card style={styles.planCard}>
              <View style={styles.planHead}>
                <View style={styles.planTexts}>
                  <Eyebrow color={theme.primary.clay}>{planLabel}</Eyebrow>
                  {!credits.isPro && (
                    <Text style={styles.planUsage}>{usedLabel}</Text>
                  )}
                </View>

                {credits.paidCredits > 0 && (
                  <Chip
                    label={t("paidCredits", { count: credits.paidCredits })}
                    tone="filled"
                    size="md"
                  />
                )}
              </View>

              {credits.fullAccess && (
                <View style={styles.planBars}>
                  <QuotaBar
                    label={t("usageAnalyses")}
                    left={credits.monthRemaining}
                    total={MONTH_CAP}
                  />
                  <QuotaBar
                    label={t("usageChat")}
                    left={credits.chatRemaining}
                    total={CHAT_MONTH_CAP}
                  />
                </View>
              )}

              {credits.isPro && (
                <Text style={styles.planRenews}>{renewsLabel}</Text>
              )}

              {!credits.isPro && (
                <Button
                  label={t("seePlans")}
                  onPress={openPaywall}
                  style={styles.planAction}
                />
              )}
            </Card>
          </View>
        </Appear>

        <Appear index={1}>
          <View style={styles.menuSection}>
            <Text family="mono" style={styles.groupLabel}>
              {t("groupSubscription")}
            </Text>

            <Card style={styles.menuCard}>
              <MenuRow
                label={t("refund")}
                icon="credit-card"
                tone="clay"
                onPress={openRefund}
              />
              <MenuRow
                label={t("restorePurchase")}
                icon="refresh-ccw"
                tone="clay"
                onPress={handleRestorePurchase}
                last
              />
            </Card>

            <Text family="mono" style={styles.groupLabel}>
              {t("groupPreferences")}
            </Text>

            <Card style={styles.menuCard}>
              <MenuRow
                label={t("notifications")}
                icon="bell"
                tone="moss"
                hint={
                  profile?.notifications_enabled === false
                    ? t("notificationsOff")
                    : t("notificationsOn")
                }
                onPress={openNotifications}
              />
              <MenuRow
                label={t("language")}
                icon="globe"
                tone="moss"
                hint={languageLabel}
                onPress={openLanguage}
              />
              <MenuRow
                label={t("temperatureUnit")}
                icon="thermometer"
                tone="moss"
                hint={
                  unit === "celsius" ? t("celsiusLabel") : t("fahrenheitLabel")
                }
                onPress={() => setUnitsVisible(true)}
                last
              />
            </Card>

            <Text family="mono" style={styles.groupLabel}>
              {t("groupHelp")}
            </Text>

            <Card style={styles.menuCard}>
              <MenuRow
                label={t("support")}
                icon="help-circle"
                tone="ochre"
                onPress={openSupport}
              />
              <MenuRow
                label={t("replayTours")}
                icon="compass"
                tone="ochre"
                onPress={replayTours}
                last
              />
            </Card>

            <Text family="mono" style={styles.groupLabel}>
              {t("groupPrivacy")}
            </Text>

            <Card style={styles.menuCard}>
              <MenuRow
                label={t("terms")}
                icon="file-text"
                onPress={openTerms}
              />
              <MenuRow
                label={t("privacy")}
                icon="shield"
                onPress={openPrivacy}
              />
              <MenuRow
                label={t("exportData")}
                icon="download"
                hint={exporting ? t("exportPreparing") : undefined}
                onPress={exportData}
              />
              <MenuRow
                label={t("revoke")}
                icon="rotate-ccw"
                onPress={openRevoke}
                last
              />
            </Card>

            <Text family="mono" style={styles.groupLabel}>
              {t("groupAccount")}
            </Text>

            <Card style={styles.menuCard}>
              <MenuRow
                label={signingOut ? t("signingOut") : t("signOut")}
                icon="log-out"
                onPress={handleSignOut}
              />
              <MenuRow
                label={t("deleteAccount")}
                icon="trash-2"
                onPress={openDeleteAccount}
                danger
                last
              />
            </Card>

            <Text family="mono" style={styles.version}>
              {t("version", { version })}
            </Text>
          </View>
        </Appear>
      </ScrollView>

      <AvatarSheet visible={photoVisible} onClose={closePhotoSheet} />

      <LanguageSheet visible={languageVisible} onClose={closeLanguage} />

      <ContainerModalCenter
        icon={<DialogIcon name="rotate-ccw" tone="danger" />}
        visible={revokeVisible}
        onClose={closeRevoke}
        title={t("revokeTitle")}
        description={t("revokeText")}
      >
        <Button
          label={t("revokeConfirm")}
          onPress={handleRevoke}
          loading={revoking}
          variant="danger"
        />
        <Button
          label={t("revokeCancel")}
          onPress={closeRevoke}
          variant="ghost"
        />
      </ContainerModalCenter>

      <UnitsSheet
        visible={unitsVisible}
        onClose={() => setUnitsVisible(false)}
      />
    </Container>
  );
}
