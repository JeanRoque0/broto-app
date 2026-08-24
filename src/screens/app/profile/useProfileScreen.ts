import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";

import { Toast } from "@/components/ui/Toast";
import { MONTH_CAP } from "@/constants";
import { useAuth } from "@/hooks/useAuth";
import { useCredits, useProfile } from "@/hooks/useProfile";
import { signOut } from "@/services/supabase/auth";
import { formatOrdinalDate } from "@/utils/format";
import { openPrivacy, openRefund, openTerms } from "@/utils/legal";
import { openSupportEmail } from "@/utils/support";

export function useProfileScreen() {
  const { t } = useTranslation("profile");
  const router = useRouter();
  const { user } = useAuth();
  const { data: profile, isLoading } = useProfile();
  const credits = useCredits();
  const [signingOut, setSigningOut] = useState(false);
  const [languageVisible, setLanguageVisible] = useState(false);
  const [photoVisible, setPhotoVisible] = useState(false);

  const name =
    profile?.display_name ?? user?.user_metadata?.name ?? t("fallbackName");
  const email = user?.email ?? "";
  const initial = name.trim().charAt(0).toUpperCase();

  const usedLabel = credits.isPro
    ? t("usedMonth", { used: credits.monthUsed, total: MONTH_CAP })
    : t("creditsLeft", { count: credits.total });

  const chatLabel = credits.hasChat
    ? t("chatLeft", { count: credits.chatRemaining })
    : null;

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
    usedLabel,
    chatLabel,
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
