import { StyleSheet } from "react-native";

import { theme } from "@/style/theme";
import { fontSize, type } from "@/style/typography";

export const styles = StyleSheet.create({
  content: {
    paddingHorizontal: theme.screenPadding,
    paddingBottom: theme.spacing.s7,
  },
  keep: {
    fontSize: fontSize.s4,
    color: theme.text.tertiary,
    marginBottom: theme.spacing.s2,
  },
  day: {
    marginTop: theme.spacing.s4,
    gap: theme.spacing.s2,
  },
  dayLabel: {
    fontSize: fontSize.s5,
    fontWeight: "700",
    color: theme.text.primary,
  },
  card: {
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.functional.line,
    backgroundColor: theme.surface.card,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.s3,
    paddingVertical: theme.spacing.s3,
    paddingHorizontal: theme.spacing.s4,
  },
  rowDivider: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: theme.functional.line,
  },
  rowIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.secondary.mossSoft,
  },
  rowIconLate: {
    backgroundColor: theme.primary.claySoft,
  },
  rowTexts: {
    flex: 1,
    gap: 1,
  },
  rowTitle: {
    ...type.sectionTitle,
  },
  rowBody: {
    ...type.bodySm,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.primary.clay,
  },
});
