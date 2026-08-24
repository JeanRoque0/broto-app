import { StyleSheet } from "react-native";

import { theme } from "@/style/theme";
import { fontSize, type } from "@/style/typography";

export const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    paddingHorizontal: theme.screenPadding,
    paddingTop: 60,
    paddingBottom: theme.spacing.s6,
  },
  topbar: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: theme.spacing.s4,
  },
  title: {
    ...type.display,
    marginTop: theme.spacing.s5,
  },
  subtitle: {
    ...type.body,
    marginTop: theme.spacing.s3,
  },
  actions: {
    marginTop: theme.spacing.s7,
    gap: theme.spacing.s3,
  },
  legalBlock: {
    marginTop: "auto",
    paddingTop: theme.spacing.s6,
  },
  legal: {
    ...type.bodySm,
    fontSize: fontSize.s3,
    textAlign: "center",
  },
});
