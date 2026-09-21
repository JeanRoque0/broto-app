import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { CameraView } from "expo-camera";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import { CameraPlantArt } from "@/components/illustrations/CameraPlantArt";
import { Button } from "@/components/ui/Button";
import { ContainerModalCenter } from "@/components/ui/ContainerModalCenter";
import { PhotoTipsSheet } from "@/components/PhotoTipsSheet";
import { TourAnchor } from "@/components/tour/TourAnchor";
import { Floating } from "@/components/ui/Floating";
import { CircleButton } from "@/components/ui/CircleButton";
import { RipplePressable } from "@/components/ui/RipplePressable";
import { Text } from "@/components/ui/Text";
import { useStatusBarStyle } from "@/hooks/useStatusBarStyle";
import { theme } from "@/style/theme";
import { haptic } from "@/utils/haptics";

import { GuideFrame } from "./components/GuideFrame";
import { PhotoReview } from "./components/PhotoReview";
import { styles } from "./style";
import { useCamera } from "./useCamera";
import { useCameraTour } from "./useCameraTour";

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
    monthCap,
    atMonthCap,
    trialLabel,
    renewsLabel,
    openPaywall,
    singlePrice,
    buying,
    handleBuySingle,
    handleClose,
    tipsVisible,
    openTips,
    closeTips,
  } = useCamera();

  useCameraTour(!!permission?.granted && photos.length === 0);

  if (!permission?.granted) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.permission}>
          {canAskAgain ? (
            <View style={styles.permissionArt}>
              <Floating>
                <CameraPlantArt size={152} />
              </Floating>
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

          <Text
            accessibilityRole="header"
            family="display"
            style={styles.permissionTitle}
          >
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

  if (photos.length > 0) {
    return (
      <PhotoReview
        uri={photos[0]}
        onRetake={() => handleRemovePhoto(0)}
        onAnalyze={handleAnalyze}
      />
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

        <GuideFrame />

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
            <View>
              <CircleButton
                onPress={openTips}
                tone="light"
                accessibilityLabel={t("tipsOpen")}
              >
                <Feather
                  name="help-circle"
                  size={17}
                  color={theme.text.onDark}
                />
              </CircleButton>
              <TourAnchor id="camera.tips" />
            </View>

            <CircleButton
              onPress={() => {
                haptic.select();
                toggleFlash();
              }}
              tone="light"
              accessibilityLabel={t("flash")}
              accessibilityRole="switch"
              accessibilityState={{ checked: flash === "on" }}
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

        {!credits.isPro && (
          <View style={[styles.credits, { top: insets.top + CREDITS_TOP }]}>
            <Text family="mono" style={styles.creditsLabel}>
              {credits.inTrial && trialLabel
                ? t("trialChip", { date: trialLabel })
                : t("credits", { count: credits.total })}
            </Text>
          </View>
        )}

        <View style={styles.hint} pointerEvents="none">
          <Text family="display" style={styles.hintTitle}>
            {t("plantTitle")}
          </Text>
          <Text style={styles.hintText}>{t("plantText")}</Text>
        </View>
      </View>

      <View style={styles.bottom}>
        <View style={styles.shutterbar}>
          <View style={styles.action}>
            <View>
              <RipplePressable
                onPress={handlePickFromGallery}
                disabled={blocked}
                pressScale={0.92}
                style={styles.sideButton}
                accessibilityRole="button"
                accessibilityLabel={t("gallery")}
              >
                <Feather name="image" size={19} color={theme.text.onDark} />
              </RipplePressable>
              <TourAnchor id="camera.gallery" />
            </View>
            <Text style={styles.actionLabel}>{t("galleryLabel")}</Text>
          </View>

          <View style={styles.action}>
            <RipplePressable
              onPress={() => {
                haptic.tap();
                handleCapture();
              }}
              disabled={capturing || blocked}
              pressScale={0.9}
              rippleColor="transparent"
              accessibilityRole="button"
              accessibilityLabel={t("shutter")}
              accessibilityState={{ busy: capturing }}
              style={[styles.shutter, capturing && styles.shutterBusy]}
            >
              <View style={styles.shutterCore} />
            </RipplePressable>
            <Text style={styles.actionLabel}>{t("shutterLabel")}</Text>
          </View>

          <View style={styles.action}>
            <View style={styles.actionPlaceholder} />
          </View>
        </View>
      </View>

      <ContainerModalCenter
        visible={blockedVisible}
        onClose={closeBlocked}
        title={atMonthCap ? t("capTitle") : t("blockedTitle")}
        description={
          atMonthCap
            ? t("capText", { cap: monthCap, date: renewsLabel })
            : t("blockedText")
        }
      >
        <Button
          label={t("blockedSingle", { price: singlePrice })}
          onPress={handleBuySingle}
          loading={buying}
        />
        {!atMonthCap && (
          <Button
            label={t("blockedPro")}
            onPress={openPaywall}
            variant="outline"
          />
        )}
        <Button
          label={t("blockedLater")}
          onPress={closeBlocked}
          variant="ghost"
        />
      </ContainerModalCenter>
    </View>
  );
}
