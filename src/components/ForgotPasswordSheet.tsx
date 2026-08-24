import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { Button } from "@/components/ui/Button";
import { ContainerModal } from "@/components/ui/ContainerModal";
import { Input } from "@/components/ui/Input";
import { Toast } from "@/components/ui/Toast";
import { useAuthErrorMessage } from "@/hooks/useAuthErrorMessage";
import { useModalAutoFocus } from "@/hooks/useModalAutoFocus";
import { requestPasswordReset } from "@/services/supabase/auth";
import { theme } from "@/style/theme";

type ForgotPasswordSheetProps = {
  visible: boolean;
  onClose: () => void;
  initialEmail?: string;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ForgotPasswordSheet({
  visible,
  onClose,
  initialEmail = "",
}: ForgotPasswordSheetProps) {
  const { t } = useTranslation("email");
  const authErrorMessage = useAuthErrorMessage();
  const [email, setEmail] = useState(initialEmail);
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);
  const { ref: inputRef, onShow, cancelAutoFocus } = useModalAutoFocus();

  useEffect(() => {
    if (visible) {
      setEmail(initialEmail);
      setError(undefined);
      return;
    }

    cancelAutoFocus();
  }, [visible, initialEmail, cancelAutoFocus]);

  async function handleSubmit() {
    const trimmed = email.trim();

    if (!EMAIL_PATTERN.test(trimmed)) {
      setError(t("emailInvalid"));
      return;
    }

    setLoading(true);
    try {
      await requestPasswordReset(trimmed);
      onClose();
      Toast.show({ text: t("resetSent"), subtitle: t("resetSentSubtitle") });
    } catch (err) {
      setError(authErrorMessage((err as Error).message ?? ""));
    } finally {
      setLoading(false);
    }
  }

  return (
    <ContainerModal
      visible={visible}
      onClose={onClose}
      keyboardAware
      onShow={onShow}
      title={t("forgotTitle")}
      description={t("forgotDescription")}
    >
      <View style={styles.content}>
        <Input
          ref={inputRef}
          label={t("email")}
          placeholder={t("emailPlaceholder")}
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            setError(undefined);
          }}
          error={error}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          returnKeyType="send"
          onSubmitEditing={handleSubmit}
        />

        <Button
          label={t("forgotSubmit")}
          onPress={handleSubmit}
          loading={loading}
        />
      </View>
    </ContainerModal>
  );
}

const styles = StyleSheet.create({
  content: {
    marginTop: theme.spacing.s5,
    gap: theme.spacing.s4,
  },
});
