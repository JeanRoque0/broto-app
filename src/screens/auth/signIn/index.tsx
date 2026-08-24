import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, View } from "react-native";

import { ForgotPasswordSheet } from "@/components/ForgotPasswordSheet";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Header } from "@/components/ui/Header";
import { Input } from "@/components/ui/Input";
import { KeyboardAwareView } from "@/components/ui/KeyboardAwareView";
import { Text } from "@/components/ui/Text";
import { useKeyboardVisible } from "@/hooks/useKeyboardVisible";
import { EMAIL_PATTERN } from "@/utils/validation";

import { styles } from "./style";
import { useSignIn } from "./useSignIn";

export default function SignInScreen() {
  const { t } = useTranslation("email");
  const keyboardVisible = useKeyboardVisible();
  const {
    control,
    errors,
    loading,
    passwordRef,
    focusPassword,
    forgotVisible,
    forgotEmail,
    openForgot,
    closeForgot,
    handleSubmit,
    goToSignUp,
  } = useSignIn();

  return (
    <Container>
      <Header showBack />

      <KeyboardAwareView style={styles.flex}>
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="always"
          showsVerticalScrollIndicator={false}
        >
          <Text family="display" style={styles.title}>
            {t("signInTitle")}
          </Text>
          <Text style={styles.subtitle}>{t("signInSubtitle")}</Text>

          <View style={styles.form}>
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
                  returnKeyType="next"
                  submitBehavior="submit"
                  onSubmitEditing={focusPassword}
                  error={errors.email?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="password"
              rules={{ required: t("passwordRequired") }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  ref={passwordRef}
                  label={t("password")}
                  placeholder={t("passwordPlaceholder")}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  isPassword
                  autoCapitalize="none"
                  autoComplete="current-password"
                  returnKeyType="go"
                  onSubmitEditing={handleSubmit}
                  error={errors.password?.message}
                />
              )}
            />

            <Pressable
              onPress={openForgot}
              hitSlop={8}
              style={styles.forgot}
              accessibilityRole="button"
            >
              <Text style={styles.forgotLabel}>{t("forgotPassword")}</Text>
            </Pressable>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Button
            label={t("signInTitle")}
            onPress={handleSubmit}
            loading={loading}
          />

          {!keyboardVisible && (
            <Pressable onPress={goToSignUp} hitSlop={8}>
              <Text style={styles.switch}>
                {t("noAccount")}
                <Text style={styles.switchAction}>{t("noAccountAction")}</Text>
              </Text>
            </Pressable>
          )}
        </View>
      </KeyboardAwareView>

      <ForgotPasswordSheet
        visible={forgotVisible}
        onClose={closeForgot}
        initialEmail={forgotEmail}
      />
    </Container>
  );
}
