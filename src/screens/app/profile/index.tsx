import Constants from "expo-constants";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, View } from "react-native";
import Animated from "react-native-reanimated";

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
import { Text } from "@/components/ui/Text";
import { LANGUAGES } from "@/constants/languages";
import { UnitsSheet } from "@/components/UnitsSheet";
import { useTemperatureUnit } from "@/hooks/useTemperatureUnit";
import { useLanguageStore } from "@/store";
import { theme } from "@/style/theme";

import { IdentityFlyer } from "./components/IdentityFlyer";
import { ProfileHeader } from "./components/ProfileHeader";
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
    scrollRef,
    scrollY,
    collapseAt,
    scrollToTop,
    onScroll,
    onIdentityLayout,
    onNameLayout,
    onAvatarLayout,
    onLayerLayout,
    onHeaderLayout,
    layerRef,
    headerRef,
    avatarRef,
    nameRef,
    origin,
    avatarAt,
    nameAt,
    headerAt,
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
      <Pressable
        ref={headerRef}
        style={styles.header}
        onLayout={onHeaderLayout}
        onPress={scrollToTop}
      >
        <ProfileHeader
          title={t("title")}
          editLabel={t("editProfile")}
          onEdit={openEditProfile}
          scrollY={scrollY}
          collapseAt={collapseAt}
        />
      </Pressable>

      <Animated.ScrollView
        ref={scrollRef}
        contentContainerStyle={[styles.content, { paddingBottom: tabBarSpace }]}
        showsVerticalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        <View style={styles.identity} onLayout={onIdentityLayout}>
          <Pressable
            ref={avatarRef}
            style={styles.avatarSlot}
            onLayout={onAvatarLayout}
            onPress={openPhotoSheet}
            accessibilityRole="button"
            accessibilityLabel={t("editPhoto")}
          />
          <View ref={nameRef} style={styles.nameWrap} onLayout={onNameLayout}>
            <Text style={styles.name}>{name}</Text>
          </View>
          <Text style={styles.email}>{email}</Text>

          <Button
            label={t("editProfile")}
            onPress={openEditProfile}
            variant="outline"
            size="md"
            fullWidth={false}
            style={styles.editButton}
          />
        </View>

        <View style={styles.section}>
          <AnnouncementBanner style={styles.banner} />

          <Card style={styles.planCard}>
            <View style={styles.planHead}>
              <View style={styles.planTexts}>
                <Eyebrow color={theme.primary.clay}>
                  {planLabel}
                </Eyebrow>
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

            {(credits.isPro || credits.hasChat) && (
              <View style={styles.planBars}>
                {credits.isPro && (
                  <QuotaBar
                    label={t("usageAnalyses")}
                    left={credits.monthRemaining}
                    total={MONTH_CAP}
                  />
                )}
                {credits.hasChat && (
                  <QuotaBar
                    label={t("usageChat")}
                    left={credits.chatRemaining}
                    total={CHAT_MONTH_CAP}
                  />
                )}
              </View>
            )}

            <Text style={styles.planRenews}>{renewsLabel}</Text>

            {!credits.isPro && (
              <Button
                label={t("seePlans")}
                onPress={openPaywall}
                style={styles.planAction}
              />
            )}
          </Card>
        </View>

        <View style={styles.menuSection}>
          <Text family="mono" style={styles.groupLabel}>
            {t("groupSubscription")}
          </Text>

          <Card style={styles.menuCard}>
            <MenuRow
              label={t("refund")}
              icon="credit-card"
              onPress={openRefund}
            />
            <MenuRow
              label={t("restorePurchase")}
              icon="refresh-ccw"
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
              hint={languageLabel}
              onPress={openLanguage}
            />
            <MenuRow
              label={t("temperatureUnit")}
              icon="thermometer"
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
              onPress={openSupport}
            />
            <MenuRow label={t("terms")} icon="file-text" onPress={openTerms} />
            <MenuRow label={t("privacy")} icon="shield" onPress={openPrivacy} />
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
      </Animated.ScrollView>

      <View
        ref={layerRef}
        style={StyleSheet.absoluteFill}
        onLayout={onLayerLayout}
        pointerEvents="none"
      >
        <IdentityFlyer
          path={profile?.avatar_path ?? null}
          initial={initial}
          name={name}
          scrollY={scrollY}
          collapseAt={collapseAt}
          origin={origin}
          avatarAt={avatarAt}
          nameAt={nameAt}
          headerAt={headerAt}
        />
      </View>

      <AvatarSheet visible={photoVisible} onClose={closePhotoSheet} />

      <LanguageSheet visible={languageVisible} onClose={closeLanguage} />

      <ContainerModalCenter
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
