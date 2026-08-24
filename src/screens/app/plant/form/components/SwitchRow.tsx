import { View } from "react-native";

import { RipplePressable } from "@/components/ui/RipplePressable";
import { Text } from "@/components/ui/Text";
import { ToggleSwitch } from "@/components/ui/ToggleSwitch";

import { styles } from "../style";

type SwitchRowProps = {
  label: string;
  hint: string;
  value: boolean;
  onChange: (value: boolean) => void;
};

export function SwitchRow({ label, hint, value, onChange }: SwitchRowProps) {
  function toggle() {
    onChange(!value);
  }

  return (
    <RipplePressable
      onPress={toggle}
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
      accessibilityLabel={label}
      accessibilityHint={hint}
      style={styles.switchRow}
    >
      <View style={styles.switchTexts}>
        <Text style={styles.switchLabel}>{label}</Text>
        <Text style={styles.switchHint}>{hint}</Text>
      </View>

      <View
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      >
        <ToggleSwitch value={value} onToggle={toggle} />
      </View>
    </RipplePressable>
  );
}
