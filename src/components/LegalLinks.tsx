import { useTranslation } from "react-i18next";
import { StyleProp, StyleSheet, TextStyle, View, ViewStyle } from "react-native";

import { RipplePressable } from "@/components/ui/RipplePressable";
import { Text } from "@/components/ui/Text";
import { theme } from "@/style/theme";
import { fontSize } from "@/style/typography";
import { openPrivacy, openTerms } from "@/utils/legal";

type LegalLinksProps = {
  lead: "legalAgreeLead" | "legalAcceptLead";
  align?: "center" | "left";
  size?: "sm" | "md";
  separator?: boolean;
  leadStyle?: StyleProp<TextStyle>;
  style?: StyleProp<ViewStyle>;
};

const HIT_SLOP = { top: 10, bottom: 10, left: 8, right: 8 };

export function LegalLinks({
  lead,
  align = "center",
  size = "sm",
  separator = true,
  leadStyle,
  style,
}: LegalLinksProps) {
  const { t } = useTranslation();
  const linkSize = size === "sm" ? styles.linkSm : styles.linkMd;

  return (
    <View style={[align === "center" && styles.centered, style]}>
      <Text style={leadStyle}>{t(lead)}</Text>

      <View style={[styles.row, align === "center" && styles.rowCentered]}>
        <RipplePressable
          onPress={openTerms}
          hitSlop={HIT_SLOP}
          accessibilityRole="link"
          style={styles.link}
        >
          <Text style={[styles.linkLabel, linkSize]}>{t("termsLink")}</Text>
        </RipplePressable>

        {separator && <Text style={styles.separator}>·</Text>}

        <RipplePressable
          onPress={openPrivacy}
          hitSlop={HIT_SLOP}
          accessibilityRole="link"
          style={styles.link}
        >
          <Text style={[styles.linkLabel, linkSize]}>{t("privacyLink")}</Text>
        </RipplePressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  centered: {
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  rowCentered: {
    justifyContent: "center",
  },
  link: {
    paddingVertical: theme.spacing.s2,
    paddingHorizontal: 6,
    borderRadius: theme.radius.sm,
  },
  linkLabel: {
    fontWeight: "700",
    color: theme.primary.clay,
    textDecorationLine: "underline",
  },
  linkSm: {
    fontSize: fontSize.s3,
  },
  linkMd: {
    fontSize: fontSize.s5,
  },
  separator: {
    fontSize: fontSize.s3,
    color: theme.text.tertiary,
  },
});
