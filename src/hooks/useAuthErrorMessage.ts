import { useCallback } from "react";
import { useTranslation } from "react-i18next";

export function useAuthErrorMessage() {
  const { t } = useTranslation("email");
  const { t: tCommon } = useTranslation();

  return useCallback(
    (message: string) => {
      if (message.includes("Invalid login credentials")) {
        return t("invalidCredentials");
      }
      if (message.includes("User already registered")) {
        return t("alreadyRegistered");
      }
      if (message.includes("Email not confirmed")) {
        return t("notConfirmed");
      }
      if (
        message.includes("you can only request this after") ||
        message.toLowerCase().includes("rate limit")
      ) {
        return t("rateLimited");
      }
      if (
        message.includes("Error sending") ||
        message.includes("error sending")
      ) {
        return t("mailerFailed");
      }
      return tCommon("requestFailedSubtitle");
    },
    [t, tCommon],
  );
}
