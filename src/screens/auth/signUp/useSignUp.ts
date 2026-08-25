import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { Toast } from "@/components/ui/Toast";
import { useAuthErrorMessage } from "@/hooks/useAuthErrorMessage";
import { resendConfirmation, signUpWithEmail } from "@/services/supabase/auth";
import { isPasswordValid } from "@/utils/password";

export type SignUpForm = {
  name: string;
  email: string;
  password: string;
};

export const SIGN_UP_STEPS = ["name", "email", "password"] as const;

export function useSignUp() {
  const { t: tCommon } = useTranslation();
  const router = useRouter();
  const authErrorMessage = useAuthErrorMessage();

  const [stepIndex, setStepIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [loading, setLoading] = useState(false);
  const [pendingEmail, setPendingEmail] = useState<string>();
  const [resending, setResending] = useState(false);

  const {
    control,
    handleSubmit,
    trigger,
    watch,
    formState: { errors },
  } = useForm<SignUpForm>({
    defaultValues: { name: "", email: "", password: "" },
    mode: "onTouched",
  });

  const step = SIGN_UP_STEPS[stepIndex];
  const isLastStep = stepIndex === SIGN_UP_STEPS.length - 1;
  const password = watch("password") ?? "";

  const submit = useCallback(
    async (values: SignUpForm) => {
      setLoading(true);

      try {
        const data = await signUpWithEmail(values);

        if (!data.session) {
          setPendingEmail(values.email);
        }
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

  const handleAdvance = useCallback(async () => {
    const valid = await trigger(step);
    if (!valid) return;

    if (isLastStep) {
      handleSubmit(submit)();
      return;
    }

    setDirection(1);
    setStepIndex((index) => index + 1);
  }, [trigger, step, isLastStep, handleSubmit, submit]);

  const handleBack = useCallback(() => {
    if (stepIndex > 0) {
      setDirection(-1);
      setStepIndex((index) => index - 1);
      return;
    }
    router.back();
  }, [stepIndex, router]);

  const handleResend = useCallback(
    async (successText: string, failureText: string) => {
      if (!pendingEmail) return;

      setResending(true);
      try {
        await resendConfirmation(pendingEmail);
        Toast.show({ text: successText });
      } catch {
        Toast.show({ text: failureText });
      } finally {
        setResending(false);
      }
    },
    [pendingEmail],
  );

  return {
    control,
    errors,
    step,
    stepIndex,
    direction,
    stepCount: SIGN_UP_STEPS.length,
    isLastStep,
    loading,
    pendingEmail,
    resending,
    password,
    canAdvance: step !== "password" || isPasswordValid(password),
    handleAdvance,
    handleBack,
    handleResend,
    goToSignIn: () => router.back(),
  };
}
