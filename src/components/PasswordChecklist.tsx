import { Feather } from "@expo/vector-icons";
import { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";

import { Text } from "@/components/ui/Text";
import { theme } from "@/style/theme";
import { fontSize } from "@/style/typography";
import {
  getPasswordChecks,
  PASSWORD_RULES,
  PasswordRule,
} from "@/utils/password";

type PasswordChecklistProps = {
  value: string;
};

const RULE_LABELS: Record<PasswordRule, "ruleLength" | "ruleUppercase" | "ruleSpecial"> = {
  length: "ruleLength",
  uppercase: "ruleUppercase",
  special: "ruleSpecial",
};

export function PasswordChecklist({ value }: PasswordChecklistProps) {
  const { t } = useTranslation("email");
  const checks = getPasswordChecks(value);

  return (
    <View style={styles.list}>
      {PASSWORD_RULES.map((rule) => (
        <Rule key={rule} met={checks[rule]} label={t(RULE_LABELS[rule])} />
      ))}
    </View>
  );
}

function Rule({ met, label }: { met: boolean; label: string }) {
  const anim = useRef(new Animated.Value(met ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(anim, {
      toValue: met ? 1 : 0,
      useNativeDriver: true,
      isInteraction: false,
      bounciness: 8,
      speed: 20,
    }).start();
  }, [met, anim]);

  return (
    <View style={styles.row}>
      <View style={[styles.marker, met && styles.markerMet]}>
        <Animated.View style={{ transform: [{ scale: anim }] }}>
          <Feather name="check" size={12} color={theme.text.onPrimary} />
        </Animated.View>
      </View>

      <Text style={[styles.label, met && styles.labelMet]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: theme.spacing.s2,
    marginTop: theme.spacing.s4,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.s3,
  },
  marker: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: theme.functional.line,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  markerMet: {
    backgroundColor: theme.secondary.moss,
    borderColor: theme.secondary.moss,
  },
  label: {
    fontSize: fontSize.s5,
    color: theme.text.secondary,
  },
  labelMet: {
    color: theme.text.primary,
  },
});
