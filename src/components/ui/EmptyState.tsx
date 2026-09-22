import React from "react";
import { StyleSheet, View } from "react-native";

import { Appear } from "@/components/ui/Appear";
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
      {illustration && <Appear index={0}>{illustration}</Appear>}

      <Appear index={1}>
        <Text family="display" style={styles.title} accessibilityRole="header">
          {title}
        </Text>
      </Appear>

      {description && (
        <Appear index={2}>
          <Text style={styles.description}>{description}</Text>
        </Appear>
      )}

      {(actionLabel || secondaryLabel) && (
        <Appear index={3} style={styles.actions}>
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
        </Appear>
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
