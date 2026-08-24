import { Feather } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import {
  SharpLightArt,
  SinglePlantArt,
  WholePlantArt,
} from "@/components/illustrations/PhotoTipsArt";
import { Button } from "@/components/ui/Button";
import {
  ContainerModal,
  ModalScrollView,
} from "@/components/ui/ContainerModal";
import { Text } from "@/components/ui/Text";
import { theme } from "@/style/theme";
import { fontSize, type } from "@/style/typography";

const TIPS = [
  { Art: WholePlantArt, title: "tipsWholeTitle", text: "tipsWholeText" },
  { Art: SharpLightArt, title: "tipsLightTitle", text: "tipsLightText" },
  { Art: SinglePlantArt, title: "tipsSingleTitle", text: "tipsSingleText" },
] as const;

type PhotoTipsSheetProps = {
  visible: boolean;
  onClose: () => void;
};

export function PhotoTipsSheet({ visible, onClose }: PhotoTipsSheetProps) {
  const { t } = useTranslation("camera");

  return (
    <ContainerModal
      visible={visible}
      onClose={onClose}
      title={t("tipsTitle")}
      description={t("tipsSubtitle")}
    >
      <ModalScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.list}>
          {TIPS.map(({ Art, title, text }) => (
            <View key={title} style={styles.tip}>
              <Art />

              <View style={styles.texts}>
                <Text style={styles.tipTitle}>{t(title)}</Text>
                <Text style={styles.tipText}>{t(text)}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.extra}>
          <Feather name="info" size={16} color={theme.primary.clay} />
          <Text style={styles.extraText}>{t("tipsExtra")}</Text>
        </View>
      </ModalScrollView>

      <Button label={t("tipsAction")} onPress={onClose} style={styles.action} />
    </ContainerModal>
  );
}

const styles = StyleSheet.create({
  list: {
    marginTop: theme.spacing.s4,
    gap: theme.spacing.s4,
  },
  tip: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.s4,
  },
  texts: {
    flex: 1,
    gap: 3,
  },
  tipTitle: {
    fontSize: fontSize.s7,
    fontWeight: "700",
    color: theme.text.primary,
  },
  tipText: {
    ...type.bodySm,
  },
  extra: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: theme.spacing.s3,
    marginTop: theme.spacing.s5,
    padding: theme.spacing.s4,
    borderRadius: theme.radius.md,
    backgroundColor: theme.primary.clayTint,
    borderWidth: 1,
    borderColor: theme.primary.clayBorder,
  },
  extraText: {
    flex: 1,
    ...type.bodySm,
    color: theme.text.primary,
  },
  action: {
    marginTop: theme.spacing.s4,
  },
});
