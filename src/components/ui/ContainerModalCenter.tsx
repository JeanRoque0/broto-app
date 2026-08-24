import { Feather } from "@expo/vector-icons";
import React from "react";
import {
  Modal,
  Pressable,
  StyleProp,
  StyleSheet,
  TextStyle,
  ViewStyle,
} from "react-native";

import { Text } from "@/components/ui/Text";
import { theme } from "@/style/theme";
import { type } from "@/style/typography";

type ContainerModalCenterProps = {
  visible: boolean;
  onClose: () => void;
  title?: string;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  showClose?: boolean;
  descriptionStyle?: StyleProp<TextStyle>;
  dialogStyle?: StyleProp<ViewStyle>;
};

export function ContainerModalCenter({
  visible,
  onClose,
  title,
  description,
  icon,
  children,
  showClose = false,
  descriptionStyle,
  dialogStyle,
}: ContainerModalCenterProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={[styles.dialog, dialogStyle]}>
          {showClose && (
            <Pressable style={styles.closeButton} onPress={onClose} hitSlop={8}>
              <Feather name="x" size={16} color={theme.text.secondary} />
            </Pressable>
          )}

          {icon}

          {title ? (
            <Text family="display" style={styles.title}>
              {title}
            </Text>
          ) : null}

          {description ? (
            <Text style={[styles.description, descriptionStyle]}>
              {description}
            </Text>
          ) : null}

          {children}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: theme.screenPadding,
    backgroundColor: theme.surface.scrim,
  },
  dialog: {
    width: "100%",
    maxWidth: 400,
    alignItems: "center",
    gap: theme.spacing.s3,
    padding: theme.spacing.s5,
    backgroundColor: theme.surface.card,
    borderWidth: 1,
    borderColor: theme.functional.line,
    borderRadius: theme.radius.lg,
  },
  closeButton: {
    position: "absolute",
    top: theme.spacing.s3,
    right: theme.spacing.s3,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.surface.container,
    zIndex: 1,
  },
  title: {
    ...type.displayXs,
    textAlign: "center",
  },
  description: {
    ...type.body,
    textAlign: "center",
  },
});
