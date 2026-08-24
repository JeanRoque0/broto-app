import { StyleSheet } from "react-native";

import { theme } from "@/style/theme";
import { fontSize, type } from "@/style/typography";

export const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  progress: {
    width: 120,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: theme.screenPadding,
    paddingBottom: theme.spacing.s5,
  },
  title: {
    ...type.display,
  },
  subtitle: {
    ...type.body,
    marginTop: theme.spacing.s3,
  },
  form: {
    marginTop: theme.spacing.s6,
    gap: theme.spacing.s4,
  },
  confirm: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: theme.screenPadding,
  },
  confirmTitle: {
    ...type.display,
    marginTop: theme.spacing.s5,
    textAlign: "center",
  },
  confirmDescription: {
    ...type.body,
    marginTop: theme.spacing.s3,
    textAlign: "center",
    maxWidth: 300,
  },
  confirmEmail: {
    marginTop: theme.spacing.s4,
    paddingVertical: theme.spacing.s3,
    paddingHorizontal: theme.spacing.s5,
    borderRadius: theme.radius.field,
    backgroundColor: theme.primary.claySoft,
    borderWidth: 1,
    borderColor: theme.primary.clayBorder,
    maxWidth: "100%",
  },
  confirmEmailText: {
    fontSize: fontSize.s7,
    fontWeight: "500",
    color: theme.primary.clay,
    textAlign: "center",
  },
  confirmHint: {
    ...type.bodySm,
    marginTop: theme.spacing.s5,
    textAlign: "center",
    maxWidth: 300,
  },
  footer: {
    paddingHorizontal: theme.screenPadding,
    paddingBottom: theme.spacing.s5,
    gap: theme.spacing.s2,
  },
  switch: {
    ...type.bodySm,
    textAlign: "center",
    paddingVertical: theme.spacing.s2,
  },
  switchAction: {
    color: theme.primary.clay,
    fontWeight: "700",
  },
});
