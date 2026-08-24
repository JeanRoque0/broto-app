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
  forgot: {
    alignSelf: "flex-start",
    marginTop: -theme.spacing.s2,
    paddingVertical: theme.spacing.s2,
  },
  forgotLabel: {
    fontSize: fontSize.s4,
    fontWeight: "700",
    color: theme.primary.clay,
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
