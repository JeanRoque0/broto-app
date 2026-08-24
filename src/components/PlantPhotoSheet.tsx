import * as ImagePicker from "expo-image-picker";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ContainerModal } from "@/components/ui/ContainerModal";
import { MenuRow } from "@/components/ui/Row";
import { Toast } from "@/components/ui/Toast";
import { theme } from "@/style/theme";

type PlantPhotoSheetProps = {
  visible: boolean;
  onClose: () => void;
  onPick: (uri: string) => void;
  onRemove?: () => void;
};

export function PlantPhotoSheet({
  visible,
  onClose,
  onPick,
  onRemove,
}: PlantPhotoSheetProps) {
  const { t } = useTranslation("plants");

  function handlePicked(result: ImagePicker.ImagePickerResult) {
    if (result.canceled) return;
    onClose();
    onPick(result.assets[0].uri);
  }

  async function takePhoto() {
    const permission = await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {
      Toast.show({
        text: t("cameraDenied"),
        subtitle: t("cameraDeniedSubtitle"),
      });
      return;
    }

    handlePicked(
      await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [3, 4],
        quality: 0.9,
      }),
    );
  }

  async function chooseFromGallery() {
    handlePicked(
      await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [3, 4],
        quality: 0.9,
      }),
    );
  }

  return (
    <ContainerModal
      visible={visible}
      onClose={onClose}
      title={t("photoSheetTitle")}
      description={t("photoSheetSubtitle")}
    >
      <View style={styles.options}>
        <MenuRow
          label={t("takePhoto")}
          icon="camera"
          onPress={takePhoto}
          right={<View />}
        />
        <MenuRow
          label={t("chooseGallery")}
          icon="image"
          onPress={chooseFromGallery}
          right={<View />}
          last={!onRemove}
        />
        {onRemove && (
          <MenuRow
            label={t("removePhoto")}
            icon="trash-2"
            danger
            onPress={() => {
              onClose();
              onRemove();
            }}
            right={<View />}
            last
          />
        )}
      </View>
    </ContainerModal>
  );
}

const styles = StyleSheet.create({
  options: {
    marginTop: theme.spacing.s4,
  },
});
