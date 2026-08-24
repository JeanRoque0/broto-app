import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { Button } from "@/components/ui/Button";
import { theme } from "@/style/theme";
import { type } from "@/style/typography";

import { Text } from "./Text";

type ErrorStateProps = {
  title?: string;
  description?: string;
  onRetry?: () => void;
  retryLabel?: string;
};

export function ErrorState({
  title,
  description,
  onRetry,
  retryLabel,
}: ErrorStateProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <MaterialIcons
        name="error-outline"
        size={40}
        color={theme.functional.danger}
      />
      <Text family="display" style={styles.title}>
        {title ?? t("errorTitle")}
      </Text>
      <Text style={styles.description}>
        {description ?? t("errorDescription")}
      </Text>
      {onRetry && (
        <Button
          label={retryLabel ?? t("retry")}
          onPress={onRetry}
          variant="outline"
          fullWidth={false}
          style={styles.action}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.s3,
    paddingHorizontal: theme.spacing.s6,
  },
  title: {
    ...type.displaySm,
    textAlign: "center",
  },
  description: {
    ...type.body,
    textAlign: "center",
    maxWidth: 260,
  },
  action: {
    marginTop: theme.spacing.s3,
    minWidth: 180,
  },
});
