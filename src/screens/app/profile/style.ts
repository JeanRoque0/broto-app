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
  screenTitle: {
    ...type.display,
  },
  identity: {
    alignItems: "center",
    marginTop: theme.spacing.s5,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: theme.primary.claySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarBadge: {
    position: "absolute",
    right: 0,
    bottom: 2,
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.primary.clay,
    borderWidth: 2.5,
    borderColor: theme.surface.base,
  },
  avatarLetter: {
    fontSize: fontSize.s13,
    fontWeight: "600",
    color: theme.primary.clay,
  },
  name: {
    fontSize: fontSize.s9,
    fontWeight: "700",
    color: theme.text.primary,
    marginTop: theme.spacing.s3,
  },
  email: {
    ...type.bodySm,
    marginTop: theme.spacing.s1,
  },
  editButton: {
    marginTop: theme.spacing.s4,
  },
  section: {
    paddingHorizontal: theme.screenPadding,
    marginTop: theme.spacing.s6,
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
  planRenews: {
    ...type.bodySm,
    marginTop: theme.spacing.s1,
  },
  planAction: {
    marginTop: theme.spacing.s4,
  },
  menuCard: {
    padding: 0,
    overflow: "hidden",
    marginTop: theme.spacing.s3,
  },
});
