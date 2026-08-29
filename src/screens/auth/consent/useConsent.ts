import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useWindowDimensions } from "react-native";

import { Toast } from "@/components/ui/Toast";
import { TERMS_VERSION } from "@/constants/legal";
import { useAuth } from "@/hooks/useAuth";
import { profileKeys, useProfile } from "@/hooks/useProfile";
import { signOut } from "@/services/supabase/auth";
import { acceptTerms } from "@/services/supabase/profile";
import { consentRevoked } from "@/utils/legal";

const STACK_ACTIONS_ABOVE = 1.4;

export function useConsent() {
  const { t } = useTranslation("consent");
  const { t: tCommon } = useTranslation();
  const router = useRouter();
  const { fontScale } = useWindowDimensions();
  const { userId } = useAuth();
  const queryClient = useQueryClient();
  const { data: profile } = useProfile();

  const revoked = !!profile && consentRevoked(profile);
  const updating = !!profile?.accepted_terms_at && !revoked;

  const [terms, setTerms] = useState(false);
  const [declining, setDeclining] = useState(false);

  const mutation = useMutation({
    mutationFn: () =>
      acceptTerms({ userId: userId!, version: TERMS_VERSION }),
    onSuccess: (profile) => {
      queryClient.setQueryData(profileKeys.detail(userId!), profile);
    },
    onError: () => {
      Toast.show({
        text: tCommon("requestFailed"),
        subtitle: tCommon("requestFailedSubtitle"),
      });
    },
  });

  async function handleDecline() {
    setDeclining(true);

    try {
      await signOut();
      queryClient.clear();
      router.replace("/(auth)/welcome");
      Toast.show({
        text: t("declinedTitle"),
        subtitle: t(updating ? "updateDeclinedSubtitle" : "declinedSubtitle"),
      });
    } catch {
      Toast.show({
        text: tCommon("requestFailed"),
        subtitle: tCommon("requestFailedSubtitle"),
      });
    } finally {
      setDeclining(false);
    }
  }

  return {
    terms,
    setTerms,
    loading: mutation.isPending,
    declining,
    updating,
    revoked,
    stackedActions: fontScale > STACK_ACTIONS_ABOVE,
    canContinue: terms && !!userId,
    handleContinue: () => mutation.mutate(),
    handleDecline,
  };
}
