import { File, Paths } from "expo-file-system";
import * as Sharing from "expo-sharing";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";

import { Toast } from "@/components/ui/Toast";
import { useAuth } from "@/hooks/useAuth";
import { collectUserData } from "@/services/supabase/exportData";
import { blockedOffline } from "@/utils/offline";

function fileName() {
  const day = new Date().toISOString().slice(0, 10);
  return `broto-meus-dados-${day}.json`;
}

export function useExportData() {
  const { t } = useTranslation("profile");
  const { userId, user } = useAuth();
  const [exporting, setExporting] = useState(false);

  const exportData = useCallback(async () => {
    if (!userId || exporting || blockedOffline()) return;

    setExporting(true);

    try {
      if (!(await Sharing.isAvailableAsync())) {
        Toast.show({ text: t("exportUnavailable") });
        return;
      }

      const bundle = await collectUserData(userId, user?.email ?? "");

      const file = new File(Paths.cache, fileName());
      if (file.exists) file.delete();

      file.create();
      file.write(JSON.stringify(bundle, null, 2));

      await Sharing.shareAsync(file.uri, {
        mimeType: "application/json",
        dialogTitle: t("exportTitle"),
        UTI: "public.json",
      });
    } catch {
      Toast.show({
        text: t("exportFailed"),
        subtitle: t("exportFailedSubtitle"),
      });
    } finally {
      setExporting(false);
    }
  }, [userId, user?.email, exporting, t]);

  return { exportData, exporting };
}
