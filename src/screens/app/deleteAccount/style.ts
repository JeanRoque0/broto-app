import { StyleSheet } from "react-native";

import { theme } from "@/style/theme";
import { fontSize, type } from "@/style/typography";

export const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  content: {
    paddingHorizontal: theme.screenPadding,
    paddingBottom: theme.spacing.s6,
  },
  headline: {
    ...type.display,
  },
  lead: {
    ...type.body,
    marginTop: theme.spacing.s2,
  },
  list: {
    marginTop: theme.spacing.s5,
    gap: theme.spacing.s3,
  },
  item: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: theme.spacing.s3,
  },
  itemIcon: {
    marginTop: 2,
  },
  itemText: {
    flex: 1,
    ...type.body,
    color: theme.text.primary,
  },
  warning: {
    marginTop: theme.spacing.s6,
    flexDirection: "row",
    gap: theme.spacing.s3,
    alignItems: "flex-start",
    backgroundColor: theme.functional.dangerSoft,
    borderColor: theme.functional.dangerBorder,
  },
  warningTexts: {
    flex: 1,
    gap: 3,
  },
  warningTitle: {
    ...type.sectionTitle,
    color: theme.functional.danger,
  },
  warningText: {
    ...type.bodySm,
    color: theme.text.primary,
  },
  check: {
    marginTop: theme.spacing.s6,
    marginHorizontal: -theme.spacing.s3,
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.s3,
    paddingVertical: theme.spacing.s3,
    paddingHorizontal: theme.spacing.s3,
    borderRadius: theme.radius.button,
  },
  checkLabel: {
    flex: 1,
    fontSize: fontSize.s6,
    color: theme.text.primary,
  },
  footer: {
    paddingHorizontal: theme.screenPadding,
    paddingTop: theme.spacing.s3,
    paddingBottom: theme.spacing.s5,
    gap: theme.spacing.s2,
  },
});
