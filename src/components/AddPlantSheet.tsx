import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ContainerModal } from "@/components/ui/ContainerModal";
import { ChoiceCard } from "@/components/ui/ChoiceCard";
import { theme } from "@/style/theme";

type AddPlantSheetProps = {
  visible: boolean;
  onClose: () => void;
  onWithPhoto: () => void;
  onManual: () => void;
};

export function AddPlantSheet({
  visible,
  onClose,
  onWithPhoto,
  onManual,
}: AddPlantSheetProps) {
  const { t } = useTranslation("plants");

  return (
    <ContainerModal
      visible={visible}
      onClose={onClose}
      title={t("addTitle")}
      description={t("addDescription")}
    >
      <View style={styles.options}>
        <ChoiceCard
          title={t("addWithPhoto")}
          description={t("addWithPhotoHint")}
          badge={t("addRecommended")}
          icon="camera"
          highlighted
          onPress={onWithPhoto}
        />
        <ChoiceCard
          title={t("addManual")}
          description={t("addManualHint")}
          icon="edit-3"
          onPress={onManual}
        />
      </View>
    </ContainerModal>
  );
}

const styles = StyleSheet.create({
  options: {
    marginTop: theme.spacing.s4,
    gap: theme.spacing.s3,
  },
});
