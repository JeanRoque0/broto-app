import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { Button } from "@/components/ui/Button";
import { ContainerModal } from "@/components/ui/ContainerModal";
import { Input } from "@/components/ui/Input";
import { useModalAutoFocus } from "@/hooks/useModalAutoFocus";
import { theme } from "@/style/theme";

type GroupSheetProps = {
  visible: boolean;
  initialName?: string;
  saving: boolean;
  onClose: () => void;
  onSubmit: (name: string) => void;
};

export function GroupSheet({
  visible,
  initialName = "",
  saving,
  onClose,
  onSubmit,
}: GroupSheetProps) {
  const { t } = useTranslation("plants");
  const { t: tCommon } = useTranslation();
  const [name, setName] = useState(initialName);
  const { ref: inputRef, onShow, cancelAutoFocus } = useModalAutoFocus();

  useEffect(() => {
    if (visible) setName(initialName);
  }, [visible, initialName]);

  const editing = initialName.length > 0;
  const trimmed = name.trim();

  return (
    <ContainerModal
      visible={visible}
      onClose={() => {
        cancelAutoFocus();
        onClose();
      }}
      onShow={onShow}
      keyboardAware
      title={t(editing ? "groupRenameTitle" : "groupSheetTitle")}
      description={editing ? undefined : t("groupSheetSubtitle")}
    >
      <View style={styles.form}>
        <Input
          ref={inputRef}
          label={t("groupNameLabel")}
          placeholder={t("groupNamePlaceholder")}
          value={name}
          onChangeText={setName}
          autoCapitalize="sentences"
          returnKeyType="done"
          onSubmitEditing={() => trimmed && onSubmit(trimmed)}
        />

        <Button
          label={editing ? tCommon("save") : t("groupCreate")}
          onPress={() => onSubmit(trimmed)}
          loading={saving}
          disabled={trimmed.length === 0}
        />
      </View>
    </ContainerModal>
  );
}

const styles = StyleSheet.create({
  form: {
    marginTop: theme.spacing.s5,
    gap: theme.spacing.s4,
  },
});
