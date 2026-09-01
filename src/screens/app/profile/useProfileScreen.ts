import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";

import { Toast } from "@/components/ui/Toast";
import { MONTH_CAP } from "@/constants";
import { useAuth } from "@/hooks/useAuth";
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
  const queryClient = useQueryClient();
  const [signingOut, setSigningOut] = useState(false);
  const [languageVisible, setLanguageVisible] = useState(false);
  const [photoVisible, setPhotoVisible] = useState(false);
  const [revokeVisible, setRevokeVisible] = useState(false);
  const [revoking, setRevoking] = useState(false);

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
