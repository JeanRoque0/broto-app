import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Header } from "@/components/ui/Header";
import { Text } from "@/components/ui/Text";
import { theme } from "@/style/theme";
import { type } from "@/style/typography";

type PendingTitleKey =
  | "paywall"
  | "editProfile"
  | "notifications"
  | "deleteAccount"
  | "newPlant"
  | "plantDetail"
  | "editPlant"
  | "analysisContext"
  | "analyzing"
  | "result";

type PendingScreenProps = {
  titleKey: PendingTitleKey;
  designRef: string;
};

export function PendingScreen({ titleKey, designRef }: PendingScreenProps) {
  const { t } = useTranslation("pending");
  const title = t(titleKey);

  return (
    <Container>
      <Header showBack title={title} />
      <View style={styles.content}>
        <Eyebrow>{t("eyebrow")}</Eyebrow>
        <Text family="display" style={styles.title}>
          {title}
        </Text>
        <Text style={styles.reference}>
          {t("reference", { screen: designRef })}
        </Text>
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.s2,
    paddingHorizontal: theme.screenPadding,
  },
  title: {
    ...type.displaySm,
    textAlign: "center",
  },
  reference: {
    ...type.bodySm,
    textAlign: "center",
  },
});
