import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ContainerModal } from "@/components/ui/ContainerModal";
import { OptionRow } from "@/components/ui/OptionRow";
import {
  TemperatureUnit,
  detectDeviceUnit,
  useTemperatureUnit,
} from "@/hooks/useTemperatureUnit";
import { theme } from "@/style/theme";

type UnitsSheetProps = {
  visible: boolean;
  onClose: () => void;
};

export function UnitsSheet({ visible, onClose }: UnitsSheetProps) {
  const { t } = useTranslation("profile");
  const { chosen, setUnit } = useTemperatureUnit();

  const device = detectDeviceUnit();
  const current = chosen ?? device;

  function pick(unit: TemperatureUnit) {
    setUnit(unit);
    onClose();
  }

  return (
    <ContainerModal
      visible={visible}
      onClose={onClose}
      eyebrow={t("temperatureUnit")}
      title={t("temperatureUnitTitle")}
      description={t("temperatureUnitSubtitle")}
    >
      <View style={styles.options}>
        <OptionRow
          label={t("celsiusLabel")}
          description={t("celsiusHint")}
          selected={current === "celsius"}
          onPress={() => pick("celsius")}
        />
        <OptionRow
          label={t("fahrenheitLabel")}
          description={t("fahrenheitHint")}
          selected={current === "fahrenheit"}
          onPress={() => pick("fahrenheit")}
        />
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
