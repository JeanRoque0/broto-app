import { StyleSheet } from "react-native";

import { theme } from "@/style/theme";
import { fontSize, type } from "@/style/typography";

export const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  content: {
    paddingHorizontal: theme.screenPadding,
    paddingBottom: theme.spacing.s6,
  },
  form: {
    marginTop: theme.spacing.s6,
    gap: theme.spacing.s4,
  },
  progress: {
    width: "60%",
  },
  title: {
    ...type.display,
  },
  subtitle: {
    ...type.body,
    marginTop: theme.spacing.s2,
  },
  field: {
    gap: theme.spacing.s2,
  },
  tempRow: {
    flexDirection: "row",
    gap: theme.spacing.s3,
  },
  tempCol: {
    flex: 1,
    gap: theme.spacing.s2,
  },
  tempCap: {
    fontSize: fontSize.s1,
    letterSpacing: 1.1,
    textTransform: "uppercase",
    color: theme.text.tertiary,
  },
  fieldLabel: {
    ...type.sectionTitle,
    fontSize: fontSize.s5,
    color: theme.text.primary,
  },
  photoTile: {
    alignSelf: "center",
    width: "78%",
    aspectRatio: 3 / 4,
    borderRadius: theme.radius.lg,
    overflow: "hidden",
    backgroundColor: theme.surface.dark,
    alignItems: "center",
    justifyContent: "center",
  },
  photoImage: {
    ...StyleSheet.absoluteFillObject,
  },
  photoPlus: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.functional.white20,
  },
  photoHint: {
    ...type.bodySm,
    color: theme.text.onDark,
    marginTop: theme.spacing.s3,
  },
  photoEdit: {
    position: "absolute",
    right: theme.spacing.s4,
    bottom: theme.spacing.s4,
  },
  photoEditButton: {
    backgroundColor: theme.functional.black35,
    borderWidth: 0,
  },
  groups: {
    gap: theme.spacing.s2,
  },
  groupsLabel: {
    ...type.sectionTitle,
    fontSize: fontSize.s5,
    color: theme.text.primary,
  },
  groupChips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.s2,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.s2,
    marginTop: theme.spacing.s1,
  },
  routine: {
    gap: theme.spacing.s2,
  },
  upsell: {
    marginTop: theme.spacing.s5,
    flexDirection: "row",
    gap: theme.spacing.s3,
    alignItems: "flex-start",
    backgroundColor: theme.primary.clayTint,
    borderColor: theme.primary.clayBorder,
  },
  upsellTexts: {
    flex: 1,
    gap: 3,
  },
  upsellTitle: {
    ...type.sectionTitle,
  },
  upsellText: {
    ...type.bodySm,
  },
  upsellAction: {
    marginTop: theme.spacing.s3,
  },

  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.s4,
    paddingVertical: theme.spacing.s4,
    paddingHorizontal: theme.spacing.s4,
    backgroundColor: theme.surface.card,
    borderWidth: 1.5,
    borderColor: theme.functional.line,
    borderRadius: theme.radius.button,
  },
  switchTexts: {
    flex: 1,
    gap: 2,
  },
  switchLabel: {
    fontSize: fontSize.s6,
    color: theme.text.primary,
  },
  switchHint: {
    ...type.bodySm,
  },
  footer: {
    paddingHorizontal: theme.screenPadding,
    paddingTop: theme.spacing.s3,
    paddingBottom: theme.spacing.s5,
    gap: theme.spacing.s2,
  },
});
