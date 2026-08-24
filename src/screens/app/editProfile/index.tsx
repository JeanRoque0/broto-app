import { Feather } from "@expo/vector-icons";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ScrollView, View } from "react-native";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { Header } from "@/components/ui/Header";
import { Input } from "@/components/ui/Input";
import { KeyboardAwareView } from "@/components/ui/KeyboardAwareView";
import { MenuRow } from "@/components/ui/Row";
import { Text } from "@/components/ui/Text";
import { theme } from "@/style/theme";

import { styles } from "./style";
import { useEditProfile } from "./useEditProfile";

export default function EditProfileScreen() {
  const { t } = useTranslation("profile");
  const {
    control,
    errors,
    email,
    isDirty,
    saving,
    sendingReset,
    handleSubmit,
    sendPasswordReset,
  } = useEditProfile();

  return (
    <Container>
      <Header showBack title={t("editTitle")} />

      <KeyboardAwareView style={styles.flex}>
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="always"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.form}>
            <Controller
              control={control}
              name="name"
              rules={{ required: t("nameRequired") }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label={t("nameLabel")}
                  placeholder={t("namePlaceholder")}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  autoCapitalize="words"
                  autoComplete="name"
                  returnKeyType="done"
                  onSubmitEditing={handleSubmit}
                  error={errors.name?.message}
                />
              )}
            />

            <View style={styles.locked}>
              <Text style={styles.lockedLabel}>{t("emailLabel")}</Text>
              <View style={styles.lockedValue}>
                <Text style={styles.lockedText} numberOfLines={1}>
                  {email}
                </Text>
                <Feather name="lock" size={16} color={theme.text.tertiary} />
              </View>
              <Text style={styles.lockedHint}>{t("emailLocked")}</Text>
            </View>
          </View>

          <Card style={styles.passwordCard}>
            <MenuRow
              label={t("changePassword")}
              icon="key"
              hint={sendingReset ? undefined : t("changePasswordHint")}
              onPress={sendPasswordReset}
              last
            />
          </Card>
        </ScrollView>

        <View style={styles.footer}>
          <Button
            label={t("saveProfile")}
            onPress={handleSubmit}
            loading={saving}
            disabled={!isDirty}
          />
        </View>
      </KeyboardAwareView>
    </Container>
  );
}
