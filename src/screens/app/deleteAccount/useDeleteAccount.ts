import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { Toast } from "@/components/ui/Toast";
import { deleteAccount } from "@/services/supabase/auth";

export function useDeleteAccount() {
  const { t } = useTranslation("profile");
  const router = useRouter();
  const queryClient = useQueryClient();

  const [understood, setUnderstood] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function confirm() {
    if (deleting) return;
    setDeleting(true);

    try {
      await deleteAccount();
      queryClient.clear();
      setConfirmVisible(false);
      Toast.show({ text: t("deleted") });
    } catch {
      setConfirmVisible(false);
      Toast.show({
        text: t("deleteFailed"),
        subtitle: t("deleteFailedSubtitle"),
      });
    } finally {
      setDeleting(false);
    }
  }

  return {
    understood,
    confirmVisible,
    deleting,
    toggleUnderstood: () => setUnderstood((value) => !value),
    openConfirm: () => setConfirmVisible(true),
    closeConfirm: () => setConfirmVisible(false),
    confirm,
    goBack: () => router.back(),
  };
}
