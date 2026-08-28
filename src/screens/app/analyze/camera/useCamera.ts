import { useQueryClient } from "@tanstack/react-query";
import { CameraView, FlashMode, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Linking } from "react-native";

import { Toast } from "@/components/ui/Toast";
import { FREE_QUOTA } from "@/constants";
import { MAX_ANALYSIS_PHOTOS } from "@/constants";
import { formatOrdinalDate } from "@/utils/format";
import {
  profileKeys,
  useCredits,
  useProfile,
  useRefreshProfileOnFocus,
} from "@/hooks/useProfile";
import { useAuth } from "@/hooks/useAuth";
import { purchaseProduct, SINGLE_ANALYSIS } from "@/services/purchases";
import { useAnalysisStore, useOnboardingStore } from "@/store";

export function useCamera() {
  const { t } = useTranslation("camera");
  const router = useRouter();
  const camera = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [flash, setFlash] = useState<FlashMode>("off");
  const [capturing, setCapturing] = useState(false);
  const [blockedVisible, setBlockedVisible] = useState(false);
  const [buying, setBuying] = useState(false);
  const { userId } = useAuth();
  const queryClient = useQueryClient();

  useRefreshProfileOnFocus();
  const { data: profile } = useProfile();
  const credits = useCredits();
  const outOfCredits = !!profile && !credits.isPro && credits.total <= 0;

  useFocusEffect(
    useCallback(() => {
      if (outOfCredits) setBlockedVisible(true);
    }, [outOfCredits]),
  );
  const photos = useAnalysisStore((state) => state.photos);
  const addPhoto = useAnalysisStore((state) => state.addPhoto);
  const removePhoto = useAnalysisStore((state) => state.removePhoto);
  const reset = useAnalysisStore((state) => state.reset);
  const photoTipsSeen = useOnboardingStore((state) => state.photoTipsSeen);
  const seePhotoTips = useOnboardingStore((state) => state.seePhotoTips);
  const [tipsVisible, setTipsVisible] = useState(!photoTipsSeen);

  const canAddMore = photos.length < MAX_ANALYSIS_PHOTOS;

  const handleCapture = useCallback(async () => {
    if (capturing || !canAddMore) return;
    setCapturing(true);

    try {
      const photo = await camera.current?.takePictureAsync({ quality: 0.9 });
      if (!photo?.uri) throw new Error("sem uri");
      addPhoto(photo.uri);
    } catch {
      Toast.show({
        text: t("captureFailed"),
        subtitle: t("captureFailedSubtitle"),
      });
    } finally {
      setCapturing(false);
    }
  }, [capturing, canAddMore, addPhoto, t]);

  const handlePickFromGallery = useCallback(async () => {
    if (!canAddMore) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.9,
      allowsMultipleSelection: true,
      selectionLimit: MAX_ANALYSIS_PHOTOS - photos.length,
    });

    if (result.canceled) return;
    result.assets.forEach((asset) => addPhoto(asset.uri));
  }, [canAddMore, photos.length, addPhoto]);

  const handleClose = useCallback(() => {
    reset();
    router.back();
  }, [reset, router]);

  return {
    tipsVisible,
    openTips: () => setTipsVisible(true),
    closeTips: () => {
      setTipsVisible(false);
      seePhotoTips();
    },
    camera,
    permission,
    requestPermission,
    flash,
    toggleFlash: () => setFlash((prev) => (prev === "off" ? "on" : "off")),
    capturing,
    photos,
    canAddMore,
    credits,
    maxPhotos: MAX_ANALYSIS_PHOTOS,
    canAskAgain: permission?.canAskAgain !== false,
    openSettings: () => Linking.openSettings(),
    handleCapture,
    handlePickFromGallery,
    handleRemovePhoto: removePhoto,
    blocked: outOfCredits,
    blockedVisible,
    closeBlocked: () => setBlockedVisible(false),
    freeQuota: FREE_QUOTA,
    renewsLabel: formatOrdinalDate(credits.renewsAt),
    openPaywall: () => {
      setBlockedVisible(false);
      router.push("/(app)/paywall");
    },
    singlePrice: SINGLE_ANALYSIS.price,
    buying,
    handleBuySingle: async () => {
      setBuying(true);

      try {
        await purchaseProduct(SINGLE_ANALYSIS.id);
        await queryClient.invalidateQueries({
          queryKey: profileKeys.detail(userId ?? ""),
        });
        setBlockedVisible(false);
      } catch {
        Toast.show({
          text: t("purchaseFailedTitle"),
          subtitle: t("purchaseFailedText"),
        });
      } finally {
        setBuying(false);
      }
    },
    handleAnalyze: () => {
      if (outOfCredits) {
        setBlockedVisible(true);
        return;
      }
      router.push("/(app)/analyze/analyzing");
    },
    handleClose,
  };
}
