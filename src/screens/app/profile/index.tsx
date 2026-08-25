import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, View } from "react-native";

import { AvatarSheet } from "@/components/AvatarSheet";
import { LanguageSheet } from "@/components/LanguageSheet";
import { PlantPhoto } from "@/components/PlantPhoto";
import { useTabBarSpace } from "@/hooks/useTabBarSpace";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { MenuRow } from "@/components/ui/Row";
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
    usedLabel,
    chatLabel,
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
    openTerms,
    openPrivacy,
    openRefund,
    openSupport,
    handleRestorePurchase,
  } = useProfileScreen();

  const { unit } = useTemperatureUnit();
  const [unitsVisible, setUnitsVisible] = useState(false);

  const languageLabel = LANGUAGES.find(
    (item) => item.code === currentLanguage,
  )?.label;

  return (
    <Container>
      <View style={styles.header}>
        <Text family="display" style={styles.screenTitle}>
          {t("title")}
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: tabBarSpace }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.identity}>
          <Pressable
            onPress={openPhotoSheet}
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
              <Feather name="edit-2" size={13} color={theme.text.onPrimary} />
            </View>
          </Pressable>
          <Text style={styles.name}>{name}</Text>
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
          <Card style={styles.planCard}>
            <View style={styles.planHead}>
              <View>
                <Eyebrow color={theme.primary.clay}>
                  {credits.isPro ? t("planPro") : t("planFree")}
                </Eyebrow>
                <Text style={styles.planUsage}>{usedLabel}</Text>
                {chatLabel && <Text style={styles.planUsage}>{chatLabel}</Text>}
                <Text style={styles.planRenews}>{renewsLabel}</Text>
              </View>

              {credits.paidCredits > 0 && (
                <Chip
                  label={t("paidCredits", { count: credits.paidCredits })}
                  tone="filled"
                  size="md"
                />
              )}
            </View>

            {!credits.isPro && (
              <Button
                label={t("seePlans")}
                onPress={openPaywall}
                style={styles.planAction}
              />
            )}
          </Card>
        </View>

        <View style={styles.section}>
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
            />
            <MenuRow
              label={t("restorePurchase")}
              icon="refresh-ccw"
              onPress={handleRestorePurchase}
              last
            />
          </Card>

          <Card style={styles.menuCard}>
            <MenuRow label={t("terms")} icon="file-text" onPress={openTerms} />
            <MenuRow label={t("privacy")} icon="shield" onPress={openPrivacy} />
            <MenuRow
              label={t("refund")}
              icon="credit-card"
              onPress={openRefund}
            />
            <MenuRow
              label={t("support")}
              icon="help-circle"
              onPress={openSupport}
              last
            />
          </Card>

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
        </View>
      </ScrollView>

      <AvatarSheet visible={photoVisible} onClose={closePhotoSheet} />

      <LanguageSheet visible={languageVisible} onClose={closeLanguage} />

      <UnitsSheet
        visible={unitsVisible}
        onClose={() => setUnitsVisible(false)}
      />
    </Container>
  );
}
