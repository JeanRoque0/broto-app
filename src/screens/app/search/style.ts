import { StyleSheet } from "react-native";

import { theme } from "@/style/theme";
import { fontSize, type } from "@/style/typography";

export const styles = StyleSheet.create({
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.spacing.s3,
  },
  history: {
    gap: 2,
    marginTop: theme.spacing.s2,
  },
  historyLabel: {
    fontSize: fontSize.s1,
    letterSpacing: 0.8,
    textTransform: "uppercase",
    color: theme.text.tertiary,
    marginBottom: theme.spacing.s2,
  },
  historyRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  historyTerm: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.s3,
    paddingVertical: theme.spacing.s3,
    paddingHorizontal: theme.spacing.s2,
    borderRadius: theme.radius.md,
  },
  historyText: {
    flex: 1,
    fontSize: fontSize.s6,
    color: theme.text.primary,
  },
  historyRemove: {
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 17,
  },
  clear: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.primary.claySoft,
  },
  header: {
    paddingHorizontal: theme.screenPadding,
    paddingTop: theme.spacing.s2,
    gap: theme.spacing.s4,
  },
  title: {
    ...type.display,
  },
  field: {
    marginBottom: theme.spacing.s2,
  },
  suggestions: {
    marginTop: theme.spacing.s5,
  },
  content: {
    paddingHorizontal: theme.screenPadding,
  },
  hint: {
    ...type.bodySm,
    textAlign: "center",
    marginTop: theme.spacing.s5,
  },
  empty: {
    alignItems: "center",
    marginTop: theme.spacing.s6,
  },
  emptyTitle: {
    ...type.displayXs,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.s4,
    padding: theme.spacing.s3,
    marginBottom: theme.spacing.s2,
    backgroundColor: theme.surface.card,
    borderWidth: 1,
    borderColor: theme.functional.line,
    borderRadius: theme.radius.md,
  },
  thumb: {
    width: 56,
    height: 56,
    borderRadius: theme.radius.field,
    overflow: "hidden",
    backgroundColor: theme.surface.photo,
  },
  thumbEmpty: {
    alignItems: "center",
    justifyContent: "center",
  },
  thumbImage: {
    ...StyleSheet.absoluteFillObject,
  },
  texts: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontSize: fontSize.s6,
    fontWeight: "700",
    color: theme.text.primary,
  },
  scientific: {
    ...type.bodySm,
    fontStyle: "italic",
  },
  gallery: {
    gap: theme.spacing.s2,
    paddingVertical: theme.spacing.s4,
  },
  photoTouch: {
    width: 190,
    height: 190,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: theme.radius.md,
    overflow: "hidden",
    backgroundColor: theme.surface.photo,
  },
  photo: {
    ...StyleSheet.absoluteFillObject,
  },
  extract: {
    ...type.bodySm,
    color: theme.text.primary,
  },
  credit: {
    fontSize: fontSize.s1,
    color: theme.text.tertiary,
    marginTop: theme.spacing.s3,
  },
  careHint: {
    ...type.bodySm,
    marginTop: theme.spacing.s4,
  },
  action: {
    marginTop: theme.spacing.s4,
  },
});
