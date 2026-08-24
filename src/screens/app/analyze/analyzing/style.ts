import { StyleSheet } from "react-native";

import { theme } from "@/style/theme";
import { fontSize, type } from "@/style/typography";

export const SCAN_HEIGHT = 3;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: theme.screenPadding,
  },
  frame: {
    width: "100%",
    maxWidth: 300,
    aspectRatio: 3 / 4,
    borderRadius: theme.radius.lg,
    overflow: "hidden",
    backgroundColor: theme.surface.container,
    borderWidth: 1,
    borderColor: theme.functional.line,
  },
  photo: {
    flex: 1,
  },
  scan: {
    position: "absolute",
    left: 0,
    right: 0,
    height: SCAN_HEIGHT,
    backgroundColor: theme.primary.clay,
    shadowColor: theme.primary.clay,
    shadowOpacity: 0.9,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 0 },
    elevation: 8,
  },
  phase: {
    ...type.displayXs,
    marginTop: theme.spacing.s6,
    textAlign: "center",
  },
  hint: {
    ...type.body,
    marginTop: theme.spacing.s2,
    textAlign: "center",
  },
  counter: {
    fontSize: fontSize.s3,
    marginTop: theme.spacing.s3,
    color: theme.text.tertiary,
    textAlign: "center",
  },
});
