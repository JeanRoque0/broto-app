import { StyleSheet } from "react-native";

import { theme } from "@/style/theme";
import { fontSize, type } from "@/style/typography";

export const styles = StyleSheet.create({
  content: {
    paddingBottom: theme.spacing.s6,
  },
  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: theme.screenPadding,
    paddingTop: theme.spacing.s4,
    paddingBottom: theme.spacing.s4,
    overflow: "hidden",
    borderTopWidth: 1,
    borderTopColor: theme.functional.line,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: theme.spacing.s2,
    marginTop: theme.spacing.s1,
  },
  copy: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: theme.spacing.s2,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.primary.claySoft,
  },
  copyLabel: {
    fontSize: fontSize.s3,
    fontWeight: "700",
    color: theme.primary.clay,
  },
  more: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 2,
    marginTop: theme.spacing.s2,
    paddingVertical: theme.spacing.s1,
  },
  moreLabel: {
    fontSize: fontSize.s5,
    fontWeight: "700",
    color: theme.primary.clay,
  },
  galleryRow: {
    marginTop: theme.spacing.s3,
    marginBottom: theme.spacing.s5,
    marginHorizontal: theme.screenPadding,
  },
  gallery: {
    gap: theme.spacing.s2,
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
    ...StyleSheet.absoluteFill,
  },
  block: {
    paddingHorizontal: theme.screenPadding,
  },
  title: {
    ...type.display,
  },
  scientific: {
    ...type.bodySm,
    fontStyle: "italic",
  },
  extract: {
    ...type.body,
    color: theme.text.primary,
    marginTop: theme.spacing.s5,
  },
  credit: {
    fontSize: fontSize.s2,
    color: theme.text.tertiary,
    marginTop: theme.spacing.s4,
  },
  careHint: {
    flexDirection: "row",
    gap: theme.spacing.s3,
    marginTop: theme.spacing.s5,
    padding: theme.spacing.s4,
    borderRadius: theme.radius.md,
    backgroundColor: theme.secondary.mossSoft,
  },
  careHintText: {
    ...type.bodySm,
    flex: 1,
    color: theme.text.primary,
  },
  suggestions: {
    marginTop: theme.spacing.s6,
  },
});
