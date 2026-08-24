import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { CameraView } from "expo-camera";
import { Image } from "expo-image";
import { useTranslation } from "react-i18next";
import { Pressable, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import { CameraPlantArt } from "@/components/illustrations/CameraPlantArt";
import { Button } from "@/components/ui/Button";
import { ContainerModalCenter } from "@/components/ui/ContainerModalCenter";
import { PhotoTipsSheet } from "@/components/PhotoTipsSheet";
import { CircleButton } from "@/components/ui/CircleButton";
import { Text } from "@/components/ui/Text";
import { useStatusBarStyle } from "@/hooks/useStatusBarStyle";
import { theme } from "@/style/theme";

import { styles } from "./style";
import { useCamera } from "./useCamera";

const CREDITS_TOP = 56;

export default function CameraScreen() {
  useStatusBarStyle("light");

  const { t } = useTranslation("camera");
  const insets = useSafeAreaInsets();
  const {
    camera,
    permission,
    requestPermission,
    flash,
    toggleFlash,
    capturing,
    photos,
    canAddMore,
    credits,
    canAskAgain,
    openSettings,
    handleCapture,
    handlePickFromGallery,
    handleRemovePhoto,
    handleAnalyze,
    blocked,
    blockedVisible,
    closeBlocked,
    freeQuota,
    renewsLabel,
    openPaywall,
    handleClose,
    tipsVisible,
    openTips,
    closeTips,
  } = useCamera();

  if (!permission?.granted) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.permission}>
          {canAskAgain ? (
            <View style={styles.permissionArt}>
              <CameraPlantArt size={152} />
            </View>
          ) : (
            <View style={styles.permissionIcon}>
              <MaterialCommunityIcons
                name="lock-outline"
                size={30}
                color={theme.text.onDark}
              />
            </View>
          )}

          <Text family="display" style={styles.permissionTitle}>
            {t(canAskAgain ? "permissionTitle" : "permissionBlockedTitle")}
          </Text>
          <Text style={styles.permissionText}>
            {t(
              canAskAgain
                ? "permissionDescription"
                : "permissionBlockedDescription",
            )}
          </Text>

          <View style={styles.permissionActions}>
            <Button
              label={t(canAskAgain ? "permissionAllow" : "permissionSettings")}
              onPress={canAskAgain ? requestPermission : openSettings}
            />
            <Button
              label={t("permissionGallery")}
              onPress={handlePickFromGallery}
              variant="outline"
              iconLeft={
                <Feather name="image" size={17} color={theme.text.onDark} />
              }
              labelStyle={styles.permissionAlt}
            />
            <Button
              label={t("permissionLater")}
              onPress={handleClose}
              variant="ghost"
              labelStyle={styles.permissionGhost}
            />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.viewfinder}>
        <CameraView
          ref={camera}
          style={styles.camera}
          facing="back"
          flash={flash}
        />

        <View style={styles.guide} pointerEvents="none" />

        <View
          style={[styles.topbar, { paddingTop: insets.top + theme.spacing.s2 }]}
        >
          <CircleButton
            onPress={handleClose}
            tone="light"
            accessibilityLabel={t("close")}
          >
            <Feather name="x" size={18} color={theme.text.onDark} />
          </CircleButton>

          <View style={styles.topActions}>
            <CircleButton
              onPress={openTips}
              tone="light"
              accessibilityLabel={t("tipsOpen")}
            >
              <Feather name="help-circle" size={17} color={theme.text.onDark} />
            </CircleButton>

            <CircleButton
              onPress={toggleFlash}
              tone="light"
              accessibilityLabel={t("flash")}
            >
              <Feather
                name={flash === "on" ? "zap" : "zap-off"}
                size={17}
                color={theme.text.onDark}
              />
            </CircleButton>
          </View>
        </View>

        <PhotoTipsSheet visible={tipsVisible} onClose={closeTips} />

        {photos.length === 0 && !credits.isPro && (
          <View style={[styles.credits, { top: insets.top + CREDITS_TOP }]}>
            <Text family="mono" style={styles.creditsLabel}>
              {t("credits", { count: credits.total })}
            </Text>
          </View>
        )}

        <View style={styles.hint} pointerEvents="none">
          <Text family="display" style={styles.hintTitle}>
            {photos.length === 0
              ? t("plantTitle")
              : canAddMore
                ? t("moreTitle")
                : t("fullTitle")}
          </Text>
          <Text style={styles.hintText}>
            {photos.length === 0
              ? t("plantText")
              : canAddMore
                ? t("moreText")
                : t("fullText")}
          </Text>
        </View>
      </View>

      <View style={styles.bottom}>
        {photos.length > 0 && (
          <View style={styles.strip}>
            {photos.map((uri, index) => (
              <Pressable
                key={uri}
                onPress={() => handleRemovePhoto(index)}
                style={styles.thumb}
                accessibilityRole="button"
                accessibilityLabel={t("removePhoto")}
              >
                <Image
                  source={{ uri }}
                  style={styles.thumbImage}
                  contentFit="cover"
                />
                <View style={styles.thumbRemove}>
                  <Feather name="x" size={11} color={theme.text.onDark} />
                </View>
              </Pressable>
            ))}
          </View>
        )}

        <View style={styles.shutterbar}>
          <View style={styles.action}>
            <Pressable
              onPress={handlePickFromGallery}
              disabled={!canAddMore}
              style={[styles.sideButton, !canAddMore && styles.disabled]}
              accessibilityRole="button"
              accessibilityLabel={t("gallery")}
            >
              <Feather name="image" size={19} color={theme.text.onDark} />
            </Pressable>
            <Text style={styles.actionLabel}>{t("galleryLabel")}</Text>
          </View>

          <View style={styles.action}>
            <Pressable
              onPress={handleCapture}
              disabled={capturing || !canAddMore}
              accessibilityRole="button"
              accessibilityLabel={t("shutter")}
              style={[
                styles.shutter,
                (capturing || !canAddMore) && styles.shutterBusy,
              ]}
            >
              <View style={styles.shutterCore} />
            </Pressable>
            <Text style={styles.actionLabel}>{t("shutterLabel")}</Text>
          </View>

          <View style={styles.action}>
            {photos.length > 0 ? (
              <>
                <Pressable
                  onPress={handleAnalyze}
                  style={[styles.analyze, blocked && styles.analyzeBlocked]}
                  accessibilityRole="button"
                  accessibilityLabel={t("analyze")}
                >
                  <Feather
                    name="arrow-right"
                    size={20}
                    color={theme.text.onPrimary}
                  />
                </Pressable>
                <Text style={styles.actionLabelStrong}>{t("analyze")}</Text>
              </>
            ) : (
              <View style={styles.actionPlaceholder} />
            )}
          </View>
        </View>
      </View>

      <ContainerModalCenter
        visible={blockedVisible}
        onClose={closeBlocked}
        title={t("blockedTitle")}
        description={t("blockedText", {
          quota: freeQuota,
          date: renewsLabel,
        })}
      >
        <Button label={t("blockedPro")} onPress={openPaywall} />
        <Button
          label={t("blockedLater")}
          onPress={closeBlocked}
          variant="ghost"
        />
      </ContainerModalCenter>
    </View>
  );
}
