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
    alignItems: "flex-start",
    gap: theme.spacing.s3,
    padding: theme.spacing.s3,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.functional.line,
    backgroundColor: theme.surface.card,
  },
  rowIconLate: {
    backgroundColor: theme.functional.dangerSoft,
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
    paddingTop: 2,
  },
  rowHead: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.s2,
  },
  rowTitle: {
    flex: 1,
    ...type.sectionTitle,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: theme.primary.clay,
  },
  rowBody: {
    ...type.bodySm,
    color: theme.text.primary,
  },
  rowTime: {
    fontSize: fontSize.s2,
    color: theme.text.tertiary,
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
