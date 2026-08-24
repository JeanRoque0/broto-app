import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { Toast } from "@/components/ui/Toast";
import { useAuth } from "@/hooks/useAuth";
import { useAuthErrorMessage } from "@/hooks/useAuthErrorMessage";
import { useProfile, useUpdateProfile } from "@/hooks/useProfile";
import { requestPasswordReset } from "@/services/supabase/auth";

type EditProfileForm = {
  name: string;
};

export function useEditProfile() {
  const { t } = useTranslation("profile");
  const { t: tCommon } = useTranslation();
  const router = useRouter();
  const { user } = useAuth();
  const { data: profile } = useProfile();
  const updateProfile = useUpdateProfile();
  const authErrorMessage = useAuthErrorMessage();

  const [sendingReset, setSendingReset] = useState(false);
  const email = user?.email ?? "";

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<EditProfileForm>({
    defaultValues: { name: "" },
    mode: "onTouched",
  });

  useEffect(() => {
    if (!profile) return;
    reset({
      name: profile.display_name ?? user?.user_metadata?.name ?? "",
    });
  }, [profile, user, reset]);

  async function submit(values: EditProfileForm) {
    try {
      await updateProfile.mutateAsync({ display_name: values.name.trim() });
      Toast.show({ text: t("profileSaved") });
      router.back();
    } catch {
      Toast.show({
        text: tCommon("requestFailed"),
        subtitle: tCommon("requestFailedSubtitle"),
      });
    }
  }

  async function sendPasswordReset() {
    if (!email || sendingReset) return;
    setSendingReset(true);

    try {
      await requestPasswordReset(email);
      Toast.show({
        text: t("passwordSent"),
        subtitle: t("passwordSentSubtitle", { email }),
      });
    } catch (error) {
      Toast.show({
        text: tCommon("requestFailed"),
        subtitle: authErrorMessage((error as Error).message ?? ""),
      });
    } finally {
      setSendingReset(false);
    }
  }

  return {
    control,
    errors,
    email,
    isDirty,
    saving: updateProfile.isPending,
    sendingReset,
    handleSubmit: handleSubmit(submit),
    sendPasswordReset,
  };
}
