import { StyleSheet } from "react-native";

import { theme } from "@/style/theme";
import { fontSize, type } from "@/style/typography";

export const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: theme.screenPadding,
    paddingBottom: theme.spacing.s5,
  },
  form: {
    marginTop: theme.spacing.s4,
    gap: theme.spacing.s4,
  },
  locked: {
    gap: theme.spacing.s2,
  },
  lockedLabel: {
    fontSize: fontSize.s3,
    fontWeight: "700",
    color: theme.text.secondary,
  },
  lockedValue: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.s3,
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: theme.radius.field,
    backgroundColor: theme.surface.container,
    borderWidth: 1.5,
    borderColor: theme.functional.line,
  },
  lockedText: {
    flex: 1,
    fontSize: fontSize.s6,
    color: theme.text.secondary,
  },
  lockedHint: {
    ...type.bodySm,
  },
  passwordCard: {
    marginTop: theme.spacing.s6,
    padding: 0,
    overflow: "hidden",
  },
  footer: {
    paddingHorizontal: theme.screenPadding,
    paddingBottom: theme.spacing.s5,
  },
});
