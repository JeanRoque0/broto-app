import { StyleSheet } from "react-native";

import { theme } from "@/style/theme";
import { fontSize, type } from "@/style/typography";

export const styles = StyleSheet.create({
  content: {
    paddingBottom: theme.spacing.s6,
  },
  copy: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: theme.spacing.s2,
    marginTop: theme.spacing.s4,
    marginLeft: -theme.spacing.s2,
    paddingVertical: theme.spacing.s2,
    paddingHorizontal: theme.spacing.s2,
    borderRadius: theme.radius.sm,
  },
  copyLabel: {
    fontSize: fontSize.s4,
    fontWeight: "700",
    color: theme.primary.clay,
  },
  galleryRow: {
    marginTop: theme.spacing.s3,
    marginBottom: theme.spacing.s5,
  },
  gallery: {
    gap: theme.spacing.s2,
    paddingHorizontal: theme.screenPadding,
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
  block: {
    paddingHorizontal: theme.screenPadding,
  },
  title: {
    ...type.display,
  },
  scientific: {
    ...type.bodySm,
    fontStyle: "italic",
    marginTop: theme.spacing.s1,
  },
  extract: {
    ...type.body,
    color: theme.text.primary,
    marginTop: theme.spacing.s5,
  },
  credit: {
    fontSize: fontSize.s1,
    color: theme.text.tertiary,
    marginTop: theme.spacing.s4,
  },
  careHint: {
    ...type.bodySm,
    marginTop: theme.spacing.s5,
  },
  suggestions: {
    marginTop: theme.spacing.s6,
  },
  action: {
    marginTop: theme.spacing.s6,
  },
});
