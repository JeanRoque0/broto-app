import React from "react";
import { StyleSheet, View } from "react-native";

import { Button } from "@/components/ui/Button";
import { theme } from "@/style/theme";
import { type } from "@/style/typography";

import { Text } from "./Text";

type EmptyStateProps = {
  illustration?: React.ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
};

export function EmptyState({
  illustration,
  title,
  description,
  actionLabel,
  onAction,
  secondaryLabel,
  onSecondary,
}: EmptyStateProps) {
  return (
    <View style={styles.container}>
      {illustration}

      <Text family="display" style={styles.title}>
        {title}
      </Text>

      {description && <Text style={styles.description}>{description}</Text>}

      {(actionLabel || secondaryLabel) && (
        <View style={styles.actions}>
          {actionLabel && onAction && (
            <Button label={actionLabel} onPress={onAction} />
          )}
          {secondaryLabel && onSecondary && (
            <Button
              label={secondaryLabel}
              onPress={onSecondary}
              variant="ghost"
            />
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingHorizontal: theme.spacing.s5,
    paddingTop: theme.spacing.s7,
  },
  title: {
    ...type.displaySm,
    marginTop: theme.spacing.s5,
    textAlign: "center",
  },
  description: {
    ...type.body,
    marginTop: theme.spacing.s3,
    maxWidth: 250,
    textAlign: "center",
  },
  actions: {
    marginTop: theme.spacing.s6,
    alignSelf: "stretch",
    paddingHorizontal: 20,
    gap: theme.spacing.s2,
  },
});
