import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ContainerModal } from "@/components/ui/ContainerModal";
import { MenuRow } from "@/components/ui/Row";
import { Toast } from "@/components/ui/Toast";
import { useAuth } from "@/hooks/useAuth";
import { useProfile, useUpdateProfile } from "@/hooks/useProfile";
import { removePhoto, uploadPhoto } from "@/services/supabase/storage";
import { theme } from "@/style/theme";

type AvatarSheetProps = {
  visible: boolean;
  onClose: () => void;
};

export function AvatarSheet({ visible, onClose }: AvatarSheetProps) {
  const { t } = useTranslation("profile");
  const { t: tCommon } = useTranslation();
  const { userId } = useAuth();
  const { data: profile } = useProfile();
  const updateProfile = useUpdateProfile();
  const [busy, setBusy] = useState(false);

  const current = profile?.avatar_path ?? null;

  async function apply(uri: string) {
    if (!userId) return;
    setBusy(true);

    try {
      const path = await uploadPhoto({ userId, uri, folder: "avatar" });
      await updateProfile.mutateAsync({ avatar_path: path });

      if (current) {
        await removePhoto(current).catch(() => undefined);
      }

      onClose();
      Toast.show({ text: t("photoUpdated") });
    } catch {
      Toast.show({
        text: tCommon("requestFailed"),
        subtitle: tCommon("requestFailedSubtitle"),
      });
    } finally {
      setBusy(false);
    }
  }

  async function takePhoto() {
    if (busy) return;

    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Toast.show({
        text: t("cameraDenied"),
        subtitle: t("cameraDeniedSubtitle"),
      });
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.9,
    });

    if (!result.canceled) apply(result.assets[0].uri);
  }

  async function chooseFromGallery() {
    if (busy) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.9,
    });

    if (!result.canceled) apply(result.assets[0].uri);
  }

  async function clearPhoto() {
    if (!current || busy) return;
    setBusy(true);

    try {
      await updateProfile.mutateAsync({ avatar_path: null });
      await removePhoto(current).catch(() => undefined);
      onClose();
      Toast.show({ text: t("photoRemoved") });
    } catch {
      Toast.show({
        text: tCommon("requestFailed"),
        subtitle: tCommon("requestFailedSubtitle"),
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <ContainerModal
      visible={visible}
      onClose={onClose}
      title={t("photoTitle")}
      description={t("photoSubtitle")}
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
        />
        {current && (
          <MenuRow
            label={t("removePhoto")}
            icon="trash-2"
            danger
            onPress={clearPhoto}
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
