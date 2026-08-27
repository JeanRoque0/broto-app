import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ContainerModal } from "@/components/ui/ContainerModal";
import { OptionRow } from "@/components/ui/OptionRow";
import { LANGUAGES, LanguageCode } from "@/constants/languages";
import { useLanguageStore } from "@/store";
import { theme } from "@/style/theme";

type LanguageSheetProps = {
  visible: boolean;
  onClose: () => void;
};

export function LanguageSheet({ visible, onClose }: LanguageSheetProps) {
  const { t } = useTranslation();
  const chosen = useLanguageStore((state) => state.chosen);
  const setLanguage = useLanguageStore((state) => state.setLanguage);
  const followSystem = useLanguageStore((state) => state.followSystem);

  function handleSelect(code: LanguageCode) {
    setLanguage(code);
    onClose();
  }

  function handleSystem() {
    followSystem();
    onClose();
  }

  return (
    <ContainerModal
      visible={visible}
      onClose={onClose}
      eyebrow={t("language")}
      title={t("languageTitle")}
      description={t("languageSubtitle")}
    >
      <View style={styles.options}>
        <OptionRow
          label={t("languageSystem")}
          selected={!chosen}
          onPress={handleSystem}
        />

        {LANGUAGES.map((language) => (
          <OptionRow
            key={language.code}
            label={language.nativeLabel}
            selected={chosen === language.code}
            onPress={() => handleSelect(language.code)}
          />
        ))}
      </View>
    </ContainerModal>
  );
}

const styles = StyleSheet.create({
  options: {
    marginTop: theme.spacing.s5,
    gap: theme.spacing.s2,
  },
});
