import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useCallback, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  LayoutChangeEvent,
  MeasureInWindowOnSuccessCallback,
  View,
} from "react-native";
import Animated, {
  SharedValue,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";

import { Toast } from "@/components/ui/Toast";
import { MONTH_CAP } from "@/constants";
import { useAuth } from "@/hooks/useAuth";
import { useExportData } from "@/hooks/useExportData";
import { useCredits, useProfile } from "@/hooks/useProfile";
import { signOut } from "@/services/supabase/auth";
import { revokeTerms } from "@/services/supabase/profile";
import { formatOrdinalDate } from "@/utils/format";
import { openPrivacy, openRefund, openTerms } from "@/utils/legal";
import { openSupportEmail } from "@/utils/support";

export function useProfileScreen() {
  const { t } = useTranslation("profile");
  const router = useRouter();
  const { user, userId } = useAuth();
  const { data: profile, isLoading } = useProfile();
  const credits = useCredits();
  const { exportData, exporting } = useExportData();
  const queryClient = useQueryClient();
  const [signingOut, setSigningOut] = useState(false);
  const [languageVisible, setLanguageVisible] = useState(false);
  const [photoVisible, setPhotoVisible] = useState(false);
  const [revokeVisible, setRevokeVisible] = useState(false);
  const [revoking, setRevoking] = useState(false);

  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollY = useSharedValue(0);
  const collapseAt = useSharedValue(0);

  const onScroll = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  const scrollToTop = useCallback(() => {
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  }, [scrollRef]);

  const layerRef = useRef<View>(null);
  const headerRef = useRef<View>(null);
  const avatarRef = useRef<View>(null);
  const nameRef = useRef<View>(null);

  const originX = useSharedValue(0);
  const originY = useSharedValue(0);
  const avatarX = useSharedValue(0);
  const avatarY = useSharedValue(0);
  const avatarH = useSharedValue(0);
  const headerX = useSharedValue(0);
  const headerY = useSharedValue(0);
  const headerH = useSharedValue(0);
  const nameX = useSharedValue(0);
  const nameY = useSharedValue(0);
  const nameH = useSharedValue(0);

  const origin = useMemo(
    () => ({ x: originX, y: originY }),
    [originX, originY],
  );
  const avatarAt = useMemo(
    () => ({ x: avatarX, y: avatarY, height: avatarH }),
    [avatarX, avatarY, avatarH],
  );
  const nameAt = useMemo(
    () => ({ x: nameX, y: nameY, height: nameH }),
    [nameX, nameY, nameH],
  );
  const headerAt = useMemo(
    () => ({ x: headerX, y: headerY, height: headerH }),
    [headerX, headerY, headerH],
  );

  const anchor = useCallback(
    (
      node: {
        measureInWindow: (callback: MeasureInWindowOnSuccessCallback) => void;
      } | null,
      target: { x: SharedValue<number>; y: SharedValue<number> },
      height?: SharedValue<number>,
      scrolls = true,
    ) => {
      node?.measureInWindow((x, y, _width, measured) => {
        target.x.value = x;
        target.y.value = scrolls ? y + scrollY.value : y;
        if (height) height.value = measured;
      });
    },
    [scrollY],
  );

  const onLayerLayout = useCallback(() => {
    anchor(layerRef.current, origin, undefined, false);
  }, [anchor, origin]);

  const onHeaderLayout = useCallback(() => {
    anchor(headerRef.current, headerAt, headerAt.height, false);
  }, [anchor, headerAt]);

  const onIdentityLayout = useCallback(
    (event: LayoutChangeEvent) => {
      const { y, height } = event.nativeEvent.layout;
      collapseAt.value = y + height;
    },
    [collapseAt],
  );

  const onAvatarLayout = useCallback(() => {
    anchor(avatarRef.current, avatarAt, avatarAt.height);
  }, [anchor, avatarAt]);

  const onNameLayout = useCallback(() => {
    anchor(nameRef.current, nameAt, nameAt.height);
  }, [anchor, nameAt]);

  const name =
    profile?.display_name ?? user?.user_metadata?.name ?? t("fallbackName");
  const email = user?.email ?? "";
  const initial = name.trim().charAt(0).toUpperCase();

  const planLabel = credits.isPro
    ? credits.period === "annual"
      ? t("planProAnnual")
      : credits.period === "monthly"
        ? t("planProMonthly")
        : t("planPro")
    : credits.hasChat
      ? credits.period === "annual"
        ? t("planChatAnnual")
        : credits.period === "monthly"
          ? t("planChatMonthly")
          : t("planChat")
      : t("planFree");

  const usedLabel = credits.isPro
    ? t("usedMonth", { used: credits.monthUsed, total: MONTH_CAP })
    : t("creditsLeft", { count: credits.total });

  const handleRevoke = useCallback(async () => {
    if (!userId) return;

    setRevoking(true);

    try {
      await revokeTerms(userId);
      await signOut();
      queryClient.clear();
      router.replace("/(auth)/welcome");
    } catch {
      Toast.show({
        text: t("revokeFailed"),
        subtitle: t("revokeFailedSubtitle"),
      });
    } finally {
      setRevoking(false);
      setRevokeVisible(false);
    }
  }, [userId, queryClient, router, t]);

  const handleSignOut = useCallback(async () => {
    setSigningOut(true);
    try {
      await signOut();
      router.replace("/(auth)/welcome");
    } catch {
      Toast.show({
        text: t("signOutFailed"),
        subtitle: t("signOutFailedSubtitle"),
      });
    } finally {
      setSigningOut(false);
    }
  }, [router, t]);

  return {
    name,
    email,
    initial,
    profile,
    credits,
    planLabel,
    usedLabel,
    renewsLabel: t("renews", { date: formatOrdinalDate(credits.renewsAt) }),
    isLoading,
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
    openLanguage: () => setLanguageVisible(true),
    closeLanguage: () => setLanguageVisible(false),
    handleSignOut,
    openEditProfile: () => router.push("/(app)/editProfile"),
    photoVisible,
    openPhotoSheet: () => setPhotoVisible(true),
    closePhotoSheet: () => setPhotoVisible(false),
    openPaywall: () => router.push("/(app)/paywall"),
    openNotifications: () => router.push("/(app)/notifications"),
    openDeleteAccount: () => router.push("/(app)/deleteAccount"),
    revokeVisible,
    revoking,
    openRevoke: () => setRevokeVisible(true),
    closeRevoke: () => setRevokeVisible(false),
    handleRevoke,
    exportData,
    exporting,
    openTerms,
    openPrivacy,
    openRefund,
    openSupport: openSupportEmail,
    handleRestorePurchase: () =>
      Toast.show({
        text: t("nothingToRestore"),
        subtitle: t("nothingToRestoreSubtitle"),
      }),
  };
}
