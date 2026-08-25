import * as Sharing from "expo-sharing";
import { useCallback, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import ViewShot from "react-native-view-shot";

import { Toast } from "@/components/ui/Toast";

export function useShareCard() {
  const { t } = useTranslation("analysis");
  const shot = useRef<ViewShot>(null);
  const [sharing, setSharing] = useState(false);

  const share = useCallback(async () => {
    if (sharing) return;

    setSharing(true);

    try {
      if (!(await Sharing.isAvailableAsync())) {
        Toast.show({ text: t("shareUnavailable") });
        return;
      }

      const uri = await shot.current?.capture?.();
      if (!uri) throw new Error("capture_failed");

      await Sharing.shareAsync(uri, {
        mimeType: "image/png",
        dialogTitle: t("shareTitle"),
      });
    } catch {
      Toast.show({ text: t("shareFailed") });
    } finally {
      setSharing(false);
    }
  }, [sharing, t]);

  return { shot, share, sharing };
}
