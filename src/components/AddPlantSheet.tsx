import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ContainerModal } from "@/components/ui/ContainerModal";
import { MenuRow } from "@/components/ui/Row";
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
        <MenuRow
          label={t("addWithPhoto")}
          description={t("addWithPhotoHint")}
          icon="camera"
          onPress={onWithPhoto}
        />
        <MenuRow
          label={t("addManual")}
          description={t("addManualHint")}
          icon="edit-3"
          onPress={onManual}
          last
        />
      </View>
    </ContainerModal>
  );
}

const styles = StyleSheet.create({
  options: {
    marginTop: theme.spacing.s4,
  },
});
