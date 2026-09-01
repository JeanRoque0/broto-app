import { StyleSheet } from "react-native";

import { theme } from "@/style/theme";
import { fontSize, type } from "@/style/typography";

export const styles = StyleSheet.create({
  version: {
    fontSize: fontSize.s1,
    letterSpacing: 0.8,
    textAlign: "center",
    color: theme.text.tertiary,
    marginTop: theme.spacing.s5,
  },
  content: {
    paddingBottom: theme.spacing.s6,
  },
  header: {
    paddingHorizontal: theme.screenPadding,
    paddingTop: theme.spacing.s2,
    paddingBottom: theme.spacing.s4,
  },
  editButton: {
    marginTop: theme.spacing.s4,
  },
  identity: {
    alignItems: "center",
    marginTop: theme.spacing.s5,
  },
  avatarSlot: {
    width: 88,
    height: 88,
  },
  nameWrap: {
    marginTop: theme.spacing.s2,
  },
  name: {
    fontSize: fontSize.s9,
    fontWeight: "700",
    color: theme.text.primary,
  },
  email: {
    ...type.bodySm,
    marginTop: theme.spacing.s1,
  },
  banner: {
    marginBottom: theme.spacing.s4,
  },
  section: {
    paddingHorizontal: theme.screenPadding,
    marginTop: theme.spacing.s6,
  },
  menuSection: {
    paddingHorizontal: theme.screenPadding,
  },
  planCard: {
    backgroundColor: theme.primary.claySoft,
    borderColor: theme.primary.clayBorder,
  },
  planHead: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: theme.spacing.s3,
  },
  planUsage: {
    fontSize: fontSize.s8,
    fontWeight: "700",
    color: theme.text.primary,
    marginTop: theme.spacing.s2,
  },
  planTexts: {
    flex: 1,
  },
  planBars: {
    gap: theme.spacing.s3,
    marginTop: theme.spacing.s4,
  },
  planRenews: {
    ...type.bodySm,
    marginTop: theme.spacing.s3,
  },
  planAction: {
    marginTop: theme.spacing.s4,
  },
  groupLabel: {
    fontSize: fontSize.s3,
    fontWeight: "500",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    color: theme.text.primary,
    marginTop: theme.spacing.s5,
    marginBottom: theme.spacing.s2,
    marginLeft: theme.spacing.s1,
  },
  menuCard: {
    padding: 0,
    overflow: "hidden",
  },
});
