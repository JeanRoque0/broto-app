import { StyleSheet } from "react-native";

import { theme } from "@/style/theme";
import { fontSize, type } from "@/style/typography";

export const styles = StyleSheet.create({
  content: {
    paddingHorizontal: theme.screenPadding,
    paddingBottom: theme.spacing.s7,
    gap: theme.spacing.s4,
  },
  subtitle: {
    ...type.bodySm,
    marginBottom: theme.spacing.s2,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.s4,
    padding: theme.spacing.s4,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.functional.line,
    backgroundColor: theme.surface.card,
  },
  texts: {
    flex: 1,
    gap: 3,
  },
  label: {
    fontSize: fontSize.s6,
    fontWeight: "500",
    color: theme.text.primary,
  },
  hint: {
    ...type.bodySm,
  },
  time: {
    fontSize: fontSize.s8,
    color: theme.primary.clay,
  },
  scheduled: {
    fontSize: fontSize.s3,
    color: theme.text.tertiary,
    textAlign: "center",
  },
  list: {
    gap: theme.spacing.s2,
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
    gap: theme.spacing.s4,
    padding: theme.spacing.s3,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.functional.line,
    backgroundColor: theme.surface.card,
  },
  rowDate: {
    width: 46,
    alignItems: "center",
  },
  rowDay: {
    fontSize: fontSize.s11,
    color: theme.primary.clay,
  },
  rowMonth: {
    fontSize: fontSize.s1,
    letterSpacing: 0.6,
    color: theme.text.tertiary,
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
    color: theme.text.secondary,
  },
  applying: {
    paddingVertical: theme.spacing.s6,
  },
  more: {
    fontSize: fontSize.s2,
    color: theme.text.tertiary,
    textAlign: "center",
    marginTop: theme.spacing.s2,
  },
  empty: {
    alignItems: "center",
    gap: theme.spacing.s2,
    paddingVertical: theme.spacing.s6,
  },
  emptyTitle: {
    ...type.displayXs,
    textAlign: "center",
  },
  blocked: {
    gap: theme.spacing.s2,
    padding: theme.spacing.s4,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.functional.dangerBorder,
    backgroundColor: theme.functional.dangerSoft,
  },
  blockedTitle: {
    fontSize: fontSize.s5,
    fontWeight: "700",
    color: theme.functional.danger,
  },
  wheels: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: theme.spacing.s4,
  },
  action: {
    marginTop: theme.spacing.s4,
  },
});
