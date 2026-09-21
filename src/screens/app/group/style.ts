import { StyleSheet } from "react-native";

import { theme } from "@/style/theme";
import { fontSize } from "@/style/typography";

export const styles = StyleSheet.create({
  content: {
    paddingHorizontal: theme.screenPadding,
  },
  actions: {
    flexDirection: "row",
    gap: theme.spacing.s2,
  },
  count: {
    fontSize: fontSize.s3,
    color: theme.text.tertiary,
    marginBottom: theme.spacing.s4,
  },
  add: {
    marginTop: theme.spacing.s4,
  },
});
