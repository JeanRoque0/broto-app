import { useRouter } from "expo-router";
import { useCallback, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { TextInput } from "react-native";

import { Toast } from "@/components/ui/Toast";
import { useAuthErrorMessage } from "@/hooks/useAuthErrorMessage";
import { signInWithEmail } from "@/services/supabase/auth";

export type SignInForm = {
  email: string;
  password: string;
};

export function useSignIn() {
  const { t: tCommon } = useTranslation();
  const router = useRouter();
  const authErrorMessage = useAuthErrorMessage();

  const [loading, setLoading] = useState(false);
  const [forgotVisible, setForgotVisible] = useState(false);
  const passwordRef = useRef<TextInput>(null);

  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<SignInForm>({
    defaultValues: { email: "", password: "" },
    mode: "onTouched",
  });

  const submit = useCallback(
    async (values: SignInForm) => {
      setLoading(true);

      try {
        await signInWithEmail(values);
      } catch (error) {
        Toast.show({
          text: tCommon("requestFailed"),
          subtitle: authErrorMessage((error as Error).message ?? ""),
        });
      } finally {
        setLoading(false);
      }
    },
    [authErrorMessage, tCommon],
  );

  return {
    control,
    errors,
    loading,
    passwordRef,
    focusPassword: () => passwordRef.current?.focus(),
    forgotVisible,
    forgotEmail: getValues("email"),
    openForgot: () => setForgotVisible(true),
    closeForgot: () => setForgotVisible(false),
    handleSubmit: handleSubmit(submit),
    goToSignUp: () => router.push("/(auth)/signUp"),
  };
}
