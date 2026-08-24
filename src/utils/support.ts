import Constants from "expo-constants";
import { Linking, Platform } from "react-native";

import { Toast } from "@/components/ui/Toast";
import { SUPPORT_EMAIL } from "@/constants/legal";
import i18n from "@/i18n";
import { useAuthStore } from "@/store";

function diagnostics() {
  const version = Constants.expoConfig?.version ?? "?";
  const build =
    Platform.OS === "ios"
      ? Constants.expoConfig?.ios?.buildNumber
      : Constants.expoConfig?.android?.versionCode;
  const userId = useAuthStore.getState().user?.id;

  return [
    `Broto ${version}${build ? ` (${build})` : ""}`,
    `${Platform.OS} ${Platform.Version}`,
    i18n.language,
    userId ? `ID ${userId}` : null,
  ]
    .filter(Boolean)
    .join("\n");
}

export async function openSupportEmail(context?: string[]) {
  const subject = i18n.t("supportSubject");
  const details = context?.filter(Boolean).join("\n");
  const body = `\n\n${i18n.t("supportBodyHint")}\n\n----------\n${
    details ? `${details}\n` : ""
  }${diagnostics()}`;

  const url = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(
    subject,
  )}&body=${encodeURIComponent(body)}`;

  try {
    await Linking.openURL(url);
  } catch {
    Toast.show({
      text: i18n.t("supportUnavailable"),
      subtitle: SUPPORT_EMAIL,
      duration: 6000,
    });
  }
}
