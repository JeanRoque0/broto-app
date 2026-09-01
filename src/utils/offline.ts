import { Toast } from "@/components/ui/Toast";
import { isOnline } from "@/hooks/useOnline";
import i18n from "@/i18n";

export function blockedOffline() {
  if (isOnline()) return false;

  Toast.show({
    text: i18n.t("offlineTitle"),
    subtitle: i18n.t("offlineBlocked"),
  });

  return true;
}
