import { StyleSheet } from "react-native";

import { theme } from "@/style/theme";
import { type } from "@/style/typography";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.spacing.s4,
    paddingHorizontal: theme.screenPadding,
    paddingTop: theme.spacing.s2,
    paddingBottom: theme.spacing.s4,
  },
  skip: {
    ...type.bodySm,
  },
  slide: {
    alignItems: "center",
    paddingHorizontal: theme.screenPadding,
    paddingTop: 40,
  },
  title: {
    ...type.display,
    marginTop: theme.spacing.s6,
    textAlign: "center",
  },
  description: {
    ...type.body,
    marginTop: theme.spacing.s4,
    maxWidth: 270,
    textAlign: "center",
  },
  footer: {
    paddingHorizontal: theme.screenPadding,
    paddingBottom: theme.spacing.s6,
    gap: theme.spacing.s5,
  },
});
