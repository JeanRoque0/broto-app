import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
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

  const [wasVisible, setWasVisible] = useState(visible);

  if (visible !== wasVisible) {
    setWasVisible(visible);
    if (visible) setName(initialName);
  }

  const editing = initialName.length > 0;
  const trimmed = name.trim();
  const suggestions = t("groupSuggestions", {
    returnObjects: true,
  }) as unknown as string[];

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

        {!editing && (
          <View style={styles.suggestions}>
            {suggestions.map((item) => (
              <Chip
                key={item}
                label={item}
                selected={trimmed === item}
                onPress={() => setName(item)}
              />
            ))}
          </View>
        )}

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
  suggestions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.s2,
    marginTop: -theme.spacing.s1,
  },
  form: {
    marginTop: theme.spacing.s5,
    gap: theme.spacing.s4,
  },
});
