import { StyleSheet } from "react-native";

import { theme } from "@/style/theme";
import { fontSize, type } from "@/style/typography";

export const styles = StyleSheet.create({
  content: {
    gap: theme.spacing.s2,
    paddingHorizontal: theme.screenPadding,
    paddingBottom: theme.spacing.s7,
  },
  listLabel: {
    fontSize: fontSize.s1,
    letterSpacing: 0.8,
    textTransform: "uppercase",
    color: theme.text.tertiary,
    marginBottom: theme.spacing.s1,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.s3,
    padding: theme.spacing.s3,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.functional.line,
    backgroundColor: theme.surface.card,
  },
  rowIcon: {
    width: 44,
    height: 44,
    borderRadius: theme.radius.field,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.primary.claySoft,
  },
  rowTexts: {
    flex: 1,
    gap: 2,
  },
  rowBody: {
    fontSize: fontSize.s6,
    color: theme.text.primary,
  },
  rowTime: {
    fontSize: fontSize.s2,
    color: theme.text.tertiary,
  },
  rowRemove: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
  },
  clear: {
    marginTop: theme.spacing.s4,
  },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.s2,
    paddingHorizontal: theme.screenPadding,
  },
  emptyTitle: {
    ...type.displayXs,
    textAlign: "center",
  },
  hint: {
    ...type.bodySm,
    textAlign: "center",
  },
});
