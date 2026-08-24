import { StyleSheet } from "react-native";

import { theme } from "@/style/theme";
import { fontSize } from "@/style/typography";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.surface.dark,
  },
  viewfinder: {
    flex: 1,
  },
  camera: {
    ...StyleSheet.absoluteFillObject,
  },
  topActions: {
    flexDirection: "row",
    gap: theme.spacing.s2,
  },
  topbar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: theme.screenPadding,
  },
  credits: {
    maxWidth: "58%",
    position: "absolute",
    alignSelf: "center",
    paddingVertical: 6,
    paddingHorizontal: 13,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.surface.scrim,
  },
  creditsLabel: {
    fontSize: fontSize.s2,
    color: theme.text.onDark,
  },
  guide: {
    position: "absolute",
    left: 46,
    right: 46,
    top: "22%",
    height: 300,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: theme.functional.white55,
  },
  hint: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: theme.spacing.s6,
    paddingHorizontal: theme.screenPadding,
    alignItems: "center",
  },
  hintTitle: {
    fontSize: fontSize.s10,
    fontWeight: "600",
    color: theme.text.onDark,
    textAlign: "center",
  },
  hintText: {
    fontSize: fontSize.s4,
    lineHeight: 18,
    marginTop: 5,
    color: theme.functional.white72,
    textAlign: "center",
  },
  bottom: {
    backgroundColor: theme.surface.dark,
  },
  strip: {
    flexDirection: "row",
    justifyContent: "center",
    gap: theme.spacing.s3,
    paddingTop: theme.spacing.s4,
  },
  thumb: {
    width: 54,
    height: 54,
    borderRadius: theme.radius.md,
    borderWidth: 2,
    borderColor: theme.functional.white55,
    overflow: "hidden",
  },
  thumbImage: {
    flex: 1,
    borderRadius: theme.radius.sm,
  },
  thumbRemove: {
    position: "absolute",
    top: 3,
    right: 3,
    width: 19,
    height: 19,
    borderRadius: 9.5,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.functional.danger,
  },
  analyze: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.primary.clay,
  },
  analyzeBlocked: {
    backgroundColor: theme.functional.white35,
  },
  actionLabelStrong: {
    fontSize: fontSize.s2,
    fontWeight: "700",
    color: theme.text.onDark,
    textAlign: "center",
  },
  disabled: {
    opacity: 0.4,
  },
  shutterbar: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingTop: theme.spacing.s4,
    paddingBottom: theme.spacing.s5,
    paddingHorizontal: theme.spacing.s4,
  },
  action: {
    flex: 1,
    alignItems: "center",
    gap: theme.spacing.s2,
  },
  actionLabel: {
    fontSize: fontSize.s2,
    fontWeight: "500",
    color: theme.functional.white72,
    textAlign: "center",
  },
  actionPlaceholder: {
    width: 48,
    height: 48,
  },
  shutter: {
    width: 74,
    height: 74,
    borderRadius: 37,
    borderWidth: 3,
    borderColor: theme.functional.white55,
    alignItems: "center",
    justifyContent: "center",
  },
  shutterBusy: {
    opacity: 0.55,
  },
  shutterCore: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.text.onPrimary,
  },
  sideButton: {
    width: 48,
    height: 48,
    borderRadius: theme.radius.md,
    borderWidth: 1.5,
    borderColor: theme.functional.white35,
    alignItems: "center",
    justifyContent: "center",
  },
  permission: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: theme.spacing.s6,
  },
  permissionArt: {
    marginBottom: theme.spacing.s4,
  },
  permissionIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.functional.white20,
  },
  permissionActions: {
    alignSelf: "stretch",
    marginTop: theme.spacing.s6,
    gap: theme.spacing.s2,
  },
  permissionAlt: {
    color: theme.text.onDark,
  },
  permissionGhost: {
    color: theme.functional.white72,
  },
  permissionTitle: {
    fontSize: fontSize.s11,
    fontWeight: "600",
    color: theme.text.onDark,
    textAlign: "center",
  },
  permissionText: {
    fontSize: fontSize.s5,
    lineHeight: 21,
    marginTop: theme.spacing.s3,
    color: theme.functional.white72,
    textAlign: "center",
  },
});
