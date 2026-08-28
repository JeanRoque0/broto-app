import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { LegalLinks } from "@/components/LegalLinks";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Checkbox } from "@/components/ui/Checkbox";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Text } from "@/components/ui/Text";
import { theme } from "@/style/theme";
import { type } from "@/style/typography";

import { useConsent } from "./useConsent";

export default function ConsentScreen() {
  const { t } = useTranslation("consent");
  const { t: tCommon } = useTranslation();
  const {
    terms,
    tips,
    setTerms,
    setTips,
    loading,
    declining,
    updating,
    stackedActions,
    canContinue,
    handleContinue,
    handleDecline,
  } = useConsent();

  return (
    <Container>
      <View style={styles.content}>
        <Eyebrow>{t(updating ? "updateEyebrow" : "eyebrow")}</Eyebrow>

        <Text family="display" style={styles.title}>
          {t(updating ? "updateTitle" : "title")}
        </Text>
        <Text style={styles.intro}>
          {t(updating ? "updateIntro" : "intro")}
        </Text>

        <Card
          style={styles.option}
          onPress={() => setTerms(!terms)}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: terms }}
        >
          <Checkbox value={terms} onChange={setTerms} />
          <View style={styles.optionText}>
            <LegalLinks
              lead="legalAcceptLead"
              align="left"
              size="md"
              separator={false}
              leadStyle={styles.optionTitle}
            />
            <Text style={styles.optionHint}>{t("termsHint")}</Text>
          </View>
        </Card>

        <Card
          style={styles.option}
          onPress={() => setTips(!tips)}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: tips }}
        >
          <Checkbox value={tips} onChange={setTips} />
          <View style={styles.optionText}>
            <Text style={styles.optionTitle}>{t("tips")}</Text>
            <Text style={styles.optionHint}>{t("tipsHint")}</Text>
          </View>
        </Card>
      </View>

      <View
        style={[styles.footer, stackedActions ? styles.footerStacked : styles.footerRow]}
      >
        <Button
          label={t("decline")}
          variant="outline"
          onPress={handleDecline}
          disabled={loading}
          loading={declining}
          fullWidth={stackedActions}
          style={stackedActions ? undefined : styles.declineAction}
        />

        <Button
          label={tCommon("continue")}
          onPress={handleContinue}
          disabled={!canContinue || declining}
          loading={loading}
          fullWidth={stackedActions}
          style={stackedActions ? undefined : styles.continueAction}
        />
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: theme.screenPadding,
    paddingTop: 70,
  },
  title: {
    ...type.display,
    marginTop: theme.spacing.s3,
  },
  intro: {
    ...type.body,
    marginTop: theme.spacing.s3,
  },
  option: {
    flexDirection: "row",
    gap: theme.spacing.s3,
    alignItems: "flex-start",
    marginTop: theme.spacing.s3,
  },
  optionText: {
    flex: 1,
    gap: theme.spacing.s1,
  },
  optionTitle: {
    ...type.sectionTitle,
  },
  optionHint: {
    ...type.bodySm,
  },
  footer: {
    paddingHorizontal: theme.screenPadding,
    paddingBottom: theme.spacing.s6,
    gap: theme.spacing.s3,
  },
  footerRow: {
    flexDirection: "row",
    alignItems: "stretch",
  },
  footerStacked: {
    flexDirection: "column-reverse",
  },
  declineAction: {
    flex: 1,
  },
  continueAction: {
    flex: 2,
  },
});
