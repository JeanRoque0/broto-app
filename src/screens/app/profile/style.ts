import { StyleSheet } from "react-native";

import { theme } from "@/style/theme";
import { fontSize, type } from "@/style/typography";

export const styles = StyleSheet.create({
  header: {
    paddingHorizontal: theme.screenPadding,
    paddingTop: theme.spacing.s2,
    paddingBottom: theme.spacing.s3,
  },
  title: {
    ...type.display,
  },
  identity: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.s4,
    marginHorizontal: theme.screenPadding,
    marginTop: theme.spacing.s2,
    padding: theme.spacing.s4,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.functional.line,
    backgroundColor: theme.surface.card,
  },
  avatarTouch: {
    width: 68,
    height: 68,
  },
  avatar: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: theme.primary.claySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarLetter: {
    fontSize: fontSize.s12,
    fontWeight: "600",
    color: theme.primary.clay,
  },
  avatarBadge: {
    position: "absolute",
    right: -2,
    bottom: -2,
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.primary.clay,
    borderWidth: 2.5,
    borderColor: theme.surface.card,
  },
  identityTexts: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontSize: fontSize.s10,
    fontWeight: "700",
    color: theme.text.primary,
  },
  email: {
    ...type.bodySm,
  },
  editLink: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 5,
    marginTop: theme.spacing.s2,
    paddingVertical: 6,
    paddingHorizontal: theme.spacing.s3,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.primary.claySoft,
  },
  editLabel: {
    fontSize: fontSize.s4,
    fontWeight: "700",
    color: theme.primary.clay,
  },
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
  banner: {
    marginBottom: theme.spacing.s4,
  },
  section: {
    paddingHorizontal: theme.screenPadding,
    marginTop: theme.spacing.s5,
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
