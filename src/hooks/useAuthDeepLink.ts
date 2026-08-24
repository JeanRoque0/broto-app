import * as Linking from "expo-linking";
import { useEffect, useRef } from "react";

import { Toast } from "@/components/ui/Toast";
import i18n from "@/i18n";
import { exchangeAuthCode, readAuthCode } from "@/services/supabase/oauth";

export function useAuthDeepLink() {
  const url = Linking.useURL();
  const handled = useRef<string | null>(null);

  useEffect(() => {
    if (!url || handled.current === url) return;
    handled.current = url;

    const code = readAuthCode(url);
    if (!code) return;

    exchangeAuthCode(code).catch(() => {
      Toast.show({
        text: i18n.t("requestFailed"),
        subtitle: i18n.t("requestFailedSubtitle"),
      });
    });
  }, [url]);
}
