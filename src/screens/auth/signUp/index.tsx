import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, View } from "react-native";

import { MailArt } from "@/components/illustrations/OnboardingArt";
import { PasswordChecklist } from "@/components/PasswordChecklist";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Header } from "@/components/ui/Header";
import { Input } from "@/components/ui/Input";
import { KeyboardAwareView } from "@/components/ui/KeyboardAwareView";
import { StepProgress } from "@/components/ui/ProgressBar";
import { StepTransition } from "@/components/ui/StepTransition";
import { Text } from "@/components/ui/Text";
import { useKeyboardVisible } from "@/hooks/useKeyboardVisible";
import { EMAIL_PATTERN } from "@/utils/validation";

import { styles } from "./style";
import { useSignUp } from "./useSignUp";

export default function SignUpScreen() {
  const { t } = useTranslation("email");
  const { t: tCommon } = useTranslation();
  const keyboardVisible = useKeyboardVisible();
  const {
    control,
    errors,
    step,
    stepIndex,
    direction,
    stepCount,
    isLastStep,
    loading,
    pendingEmail,
    resending,
    canAdvance,
    password,
    handleAdvance,
    handleBack,
    handleResend,
    goToSignIn,
  } = useSignUp();

  if (pendingEmail) {
    return (
      <Container>
        <Header />

        <View style={styles.confirm}>
          <MailArt size={132} />

          <Text family="display" style={styles.confirmTitle}>
            {t("confirmTitle")}
          </Text>
          <Text style={styles.confirmDescription}>
            {t("confirmDescription")}
          </Text>

          <View style={styles.confirmEmail}>
            <Text family="mono" style={styles.confirmEmailText}>
              {pendingEmail}
            </Text>
          </View>

          <Text style={styles.confirmHint}>{t("confirmHint")}</Text>
        </View>

        <View style={styles.footer}>
          <Button
            label={t("confirmResend")}
            onPress={() =>
              handleResend(t("confirmResent"), t("confirmResendFailed"))
            }
            loading={resending}
            variant="outline"
          />
          <Button
            label={t("confirmBack")}
            onPress={goToSignIn}
            variant="ghost"
          />
        </View>
      </Container>
    );
  }

  return (
    <Container>
      <Header
        showBack
        onBack={handleBack}
        center={
          <StepProgress
            total={stepCount}
            current={stepIndex + 1}
            style={styles.progress}
          />
        }
      />

      <KeyboardAwareView style={styles.flex}>
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="always"
          showsVerticalScrollIndicator={false}
        >
          <StepTransition stepKey={step} direction={direction}>
            <Text family="display" style={styles.title}>
              {t(`${step}StepTitle` as const)}
            </Text>
            <Text style={styles.subtitle}>
              {t(`${step}StepSubtitle` as const)}
            </Text>
          </StepTransition>

          <StepTransition
            stepKey={step}
            direction={direction}
            style={styles.form}
          >
            {step === "name" && (
              <Controller
                control={control}
                name="name"
                rules={{ required: t("nameRequired") }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label={t("name")}
                    placeholder={t("namePlaceholder")}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    autoCapitalize="words"
                    autoComplete="name"
                    autoFocus
                    returnKeyType="next"
                    onSubmitEditing={handleAdvance}
                    error={errors.name?.message}
                  />
                )}
              />
            )}

            {step === "email" && (
              <Controller
                control={control}
                name="email"
                rules={{
                  required: t("emailRequired"),
                  pattern: { value: EMAIL_PATTERN, message: t("emailInvalid") },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label={t("email")}
                    placeholder={t("emailPlaceholder")}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                    autoFocus
                    returnKeyType="next"
                    onSubmitEditing={handleAdvance}
                    error={errors.email?.message}
                  />
                )}
              />
            )}

            {step === "password" && (
              <>
                <Controller
                  control={control}
                  name="password"
                  rules={{ required: t("passwordRequired") }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      label={t("password")}
                      placeholder={t("createPasswordPlaceholder")}
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      isPassword
                      autoCapitalize="none"
                      autoComplete="new-password"
                      autoFocus
                      returnKeyType="done"
                      onSubmitEditing={handleAdvance}
                    />
                  )}
                />

                <PasswordChecklist value={password} />
              </>
            )}
          </StepTransition>
        </ScrollView>

        <View style={styles.footer}>
          <Button
            label={isLastStep ? t("signUpTitle") : tCommon("continue")}
            onPress={handleAdvance}
            loading={loading}
            disabled={!canAdvance}
          />

          {!keyboardVisible && (
            <Pressable onPress={goToSignIn} hitSlop={8}>
              <Text style={styles.switch}>
                {t("hasAccount")}
                <Text style={styles.switchAction}>{t("hasAccountAction")}</Text>
              </Text>
            </Pressable>
          )}
        </View>
      </KeyboardAwareView>
    </Container>
  );
}
