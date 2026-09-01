import { StyleSheet } from "react-native";

import { theme } from "@/style/theme";
import { fontSize, type } from "@/style/typography";

export const styles = StyleSheet.create({
  pager: {
    flex: 1,
  },
  tabs: {
    marginBottom: theme.spacing.s3,
  },
  banner: {
    marginHorizontal: theme.screenPadding,
    marginBottom: theme.spacing.s4,
  },
  topbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: theme.screenPadding,
    paddingTop: theme.spacing.s2,
    paddingBottom: theme.spacing.s4,
  },
  screenTitle: {
    ...type.display,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.s2,
  },
  titleGroup: {
    flex: 1,
    gap: 2,
  },
  count: {
    fontSize: fontSize.s3,
    color: theme.text.secondary,
  },
});
