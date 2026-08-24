import { AntDesign, Feather } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { ScrollView, View } from "react-native";

import { GoogleMark } from "@/components/illustrations/GoogleMark";
import { Logo } from "@/components/illustrations/Logo";
import { LanguageButton } from "@/components/LanguageButton";
import { LegalLinks } from "@/components/LegalLinks";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Text } from "@/components/ui/Text";
import { theme } from "@/style/theme";

import { styles } from "./style";
import { useWelcome } from "./useWelcome";

export default function WelcomeScreen() {
  const { t } = useTranslation("welcome");
  const { loading, showApple, handleApple, handleGoogle, handleEmail } =
    useWelcome();

  return (
    <Container>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topbar}>
          <Logo />
          <LanguageButton />
        </View>

        <Text family="display" style={styles.title}>
          {t("title")}
        </Text>
        <Text style={styles.subtitle}>{t("subtitle")}</Text>

        <View style={styles.actions}>
          {showApple && (
            <Button
              label={t("apple")}
              onPress={handleApple}
              variant="dark"
              loading={loading === "apple"}
              disabled={!!loading}
              iconLeft={
                <AntDesign name="apple" size={17} color={theme.text.onDark} />
              }
            />
          )}

          <Button
            label={t("google")}
            onPress={handleGoogle}
            variant="social"
            loading={loading === "google"}
            disabled={!!loading}
            iconLeft={<GoogleMark size={18} />}
          />

          <Button
            label={t("email")}
            onPress={handleEmail}
            variant="social"
            disabled={!!loading}
            iconLeft={
              <Feather name="mail" size={18} color={theme.text.secondary} />
            }
          />
        </View>

        <LegalLinks lead="legalAgreeLead" leadStyle={styles.legal} style={styles.legalBlock} />
      </ScrollView>
    </Container>
  );
}
