import { StyleSheet } from "react-native";

import { theme } from "@/style/theme";
import { fontSize, type } from "@/style/typography";

export const styles = StyleSheet.create({
  content: {
    gap: theme.spacing.s3,
    paddingHorizontal: theme.screenPadding,
    paddingBottom: theme.spacing.s6,
  },
  progress: {
    fontSize: fontSize.s2,
    letterSpacing: 0.6,
    textTransform: "uppercase",
    color: theme.text.tertiary,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  streak: {
    fontSize: fontSize.s2,
    color: theme.text.tertiary,
  },
  streakChip: {
    fontSize: fontSize.s3,
    fontWeight: "700",
    color: theme.secondary.moss,
  },
  ask: {
    ...type.displayXs,
    marginBottom: theme.spacing.s2,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.s3,
    padding: theme.spacing.s4,
    borderRadius: theme.radius.md,
    borderWidth: 1.5,
    borderColor: theme.functional.line,
    backgroundColor: theme.surface.card,
  },
  optionRight: {
    borderColor: theme.secondary.moss,
    backgroundColor: theme.secondary.mossSoft,
  },
  optionWrong: {
    borderColor: theme.functional.dangerBorder,
    backgroundColor: theme.functional.dangerSoft,
  },
  optionText: {
    flex: 1,
    fontSize: fontSize.s6,
    color: theme.text.primary,
  },
  why: {
    padding: theme.spacing.s4,
    borderRadius: theme.radius.md,
    backgroundColor: theme.surface.container,
  },
  whyText: {
    ...type.bodySm,
  },
  footer: {
    paddingHorizontal: theme.screenPadding,
    paddingBottom: theme.spacing.s6,
  },
  over: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.s2,
    paddingHorizontal: theme.screenPadding,
  },
  overScore: {
    fontSize: fontSize.s13,
    color: theme.primary.clay,
    marginTop: theme.spacing.s4,
  },
  overText: {
    ...type.bodySm,
    textAlign: "center",
  },
  action: {
    alignSelf: "stretch",
    marginTop: theme.spacing.s5,
  },
});
