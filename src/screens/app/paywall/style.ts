import { StyleSheet } from "react-native";

import { theme } from "@/style/theme";
import { fontSize, type } from "@/style/typography";

export const styles = StyleSheet.create({
  content: {
    paddingHorizontal: theme.screenPadding,
    paddingBottom: theme.spacing.s7,
  },
  title: {
    ...type.display,
  },
  subtitle: {
    ...type.bodySm,
    marginTop: 4,
    marginBottom: theme.spacing.s5,
  },
  usage: {
    gap: theme.spacing.s3,
    padding: theme.spacing.s4,
    borderRadius: theme.radius.md,
    backgroundColor: theme.surface.container,
    marginBottom: theme.spacing.s5,
  },
  usageRow: {
    gap: 6,
  },
  usageHead: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
  },
  usageLabel: {
    fontSize: fontSize.s5,
    fontWeight: "500",
    color: theme.text.primary,
  },
  usageValue: {
    fontSize: fontSize.s3,
    color: theme.text.secondary,
  },
  track: {
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.surface.muted,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: 3,
    backgroundColor: theme.secondary.moss,
  },
  fillWarn: {
    backgroundColor: theme.primary.clay,
  },
  credits: {
    fontSize: fontSize.s11,
    color: theme.text.primary,
  },
  creditsHint: {
    ...type.bodySm,
  },
  renews: {
    fontSize: fontSize.s2,
    color: theme.text.tertiary,
  },
  segment: {
    marginHorizontal: 0,
    marginBottom: theme.spacing.s5,
  },
  plans: {
    gap: theme.spacing.s3,
  },
  plan: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.s3,
    padding: theme.spacing.s4,
    borderRadius: theme.radius.md,
    borderWidth: 1.5,
    borderColor: theme.functional.line,
    backgroundColor: theme.surface.card,
  },
  planActive: {
    borderColor: theme.secondary.moss,
    backgroundColor: theme.secondary.mossSoft,
  },
  planTexts: {
    flex: 1,
    gap: 3,
  },
  planHead: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.s2,
  },
  planName: {
    fontSize: fontSize.s4,
    fontWeight: "700",
    letterSpacing: 0.6,
    textTransform: "uppercase",
    color: theme.text.secondary,
  },
  planPrice: {
    fontSize: fontSize.s8,
    fontWeight: "700",
    color: theme.text.primary,
  },
  planPeriod: {
    ...type.bodySm,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.primary.claySoft,
  },
  badgeText: {
    fontSize: fontSize.s1,
    fontWeight: "700",
    color: theme.primary.clay,
  },
  features: {
    gap: theme.spacing.s3,
    marginTop: theme.spacing.s5,
  },
  feature: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: theme.spacing.s3,
  },
  featureText: {
    flex: 1,
    fontSize: fontSize.s5,
    color: theme.text.primary,
  },
  caps: {
    gap: 4,
    marginTop: theme.spacing.s5,
    padding: theme.spacing.s4,
    borderRadius: theme.radius.md,
    backgroundColor: theme.surface.container,
  },
  capsTitle: {
    fontSize: fontSize.s4,
    fontWeight: "500",
    color: theme.text.primary,
  },
  capsText: {
    ...type.bodySm,
  },
  single: {
    marginTop: theme.spacing.s5,
    padding: theme.spacing.s4,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.functional.line,
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.s3,
  },
  singleTexts: {
    flex: 1,
    gap: 2,
  },
  singleTitle: {
    fontSize: fontSize.s4,
    fontWeight: "700",
    color: theme.text.primary,
  },
  singleText: {
    ...type.bodySm,
  },
  action: {
    marginTop: theme.spacing.s5,
  },
  restore: {
    marginTop: theme.spacing.s3,
  },
  storeNote: {
    ...type.bodySm,
    fontSize: fontSize.s2,
    textAlign: "center",
    marginTop: theme.spacing.s4,
  },
  links: {
    flexDirection: "row",
    justifyContent: "center",
    gap: theme.spacing.s4,
    marginTop: theme.spacing.s3,
  },
  link: {
    fontSize: fontSize.s3,
    color: theme.text.secondary,
    textDecorationLine: "underline",
  },
});
