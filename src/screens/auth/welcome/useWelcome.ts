import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { Toast } from "@/components/ui/Toast";
import {
  isAppleSignInAvailable,
  signInWithApple,
  signInWithProvider,
} from "@/services/supabase/oauth";

type Provider = "apple" | "google";

const CANCELLED_CODES = ["ERR_REQUEST_CANCELED", "ERR_CANCELED"];

export function useWelcome() {
  const { t } = useTranslation("welcome");
  const router = useRouter();
  const [loading, setLoading] = useState<Provider | null>(null);
  const [showApple, setShowApple] = useState(false);

  useEffect(() => {
    let active = true;
    isAppleSignInAvailable().then((available) => {
      if (active) setShowApple(available);
    });
    return () => {
      active = false;
    };
  }, []);

  const handleProvider = useCallback(
    async (provider: Provider) => {
      setLoading(provider);

      try {
        if (provider === "apple") {
          await signInWithApple();
        } else {
          await signInWithProvider("google");
        }
      } catch (error) {
        const code = (error as { code?: string })?.code;
        if (code && CANCELLED_CODES.includes(code)) return;

        Toast.show({
          text: t("signInFailed"),
          subtitle: t("signInFailedSubtitle"),
        });
      } finally {
        setLoading(null);
      }
    },
    [t],
  );

  return {
    loading,
    showApple,
    handleApple: () => handleProvider("apple"),
    handleGoogle: () => handleProvider("google"),
    handleEmail: () => router.push("/(auth)/signIn"),
  };
}
