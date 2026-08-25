import { StyleSheet } from "react-native";

import { theme } from "@/style/theme";
import { fontSize, type } from "@/style/typography";

export const HEADER_PHOTO = 340;
export const BAR_HEIGHT = 52;

export const styles = StyleSheet.create({
  suggestionsBlock: {
    marginTop: theme.spacing.s5,
  },
  flex: {
    flex: 1,
  },
  hero: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: HEADER_PHOTO,
    backgroundColor: theme.surface.container,
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  heroFade: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 90,
  },
  bar: {
    position: "absolute",
    left: 0,
    right: 0,
    backgroundColor: theme.surface.baseTranslucent,
    borderBottomWidth: 1,
    borderBottomColor: theme.functional.line,
  },
  barInner: {
    height: BAR_HEIGHT,
    justifyContent: "center",
    paddingHorizontal: 72,
  },
  barTitle: {
    ...type.sectionTitle,
    textAlign: "center",
  },
  back: {
    position: "absolute",
    left: theme.spacing.s5,
  },
  share: {
    position: "absolute",
    right: theme.spacing.s5,
  },
  backOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  backOnPhoto: {
    backgroundColor: theme.functional.black35,
    borderWidth: 0,
  },
  heroTouch: {
    height: HEADER_PHOTO - 24,
  },
  sheet: {
    borderTopLeftRadius: theme.radius.sheet,
    borderTopRightRadius: theme.radius.sheet,
    backgroundColor: theme.surface.base,
    paddingTop: theme.spacing.s5,
    paddingBottom: theme.spacing.s7,
  },
  padded: {
    paddingHorizontal: theme.screenPadding,
  },
  species: {
    ...type.display,
    marginTop: theme.spacing.s2,
  },
  scientific: {
    ...type.bodySm,
    fontStyle: "italic",
    marginTop: 2,
  },
  unknownHint: {
    ...type.body,
    marginTop: theme.spacing.s2,
  },
  status: {
    marginTop: theme.spacing.s5,
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.s3,
    paddingVertical: theme.spacing.s3,
    paddingHorizontal: theme.spacing.s4,
    borderRadius: theme.radius.md,
  },
  statusOk: {
    backgroundColor: theme.secondary.mossSoft,
  },
  statusWarn: {
    backgroundColor: theme.primary.claySoft,
  },
  statusText: {
    ...type.sectionTitle,
    flex: 1,
  },
  tiles: {
    marginTop: theme.spacing.s3,
  },
  section: {
    marginTop: theme.spacing.s6,
  },
  sectionTitle: {
    ...type.displayXs,
    marginTop: theme.spacing.s2,
  },
  swipeHint: {
    fontSize: fontSize.s2,
    color: theme.text.tertiary,
    marginTop: theme.spacing.s1,
  },
  carousel: {
    paddingHorizontal: theme.screenPadding,
    gap: theme.spacing.s3,
    paddingTop: theme.spacing.s3,
  },
  dots: {
    marginTop: theme.spacing.s3,
    alignSelf: "center",
  },
  infoCard: {
    marginTop: theme.spacing.s4,
  },
  confirm: {
    marginTop: theme.spacing.s3,
    gap: theme.spacing.s2,
    backgroundColor: theme.primary.claySoft,
    borderColor: theme.primary.clayBorder,
  },
  confirmText: {
    fontSize: fontSize.s6,
    lineHeight: 22,
    color: theme.text.primary,
  },
  toxic: {
    marginTop: theme.spacing.s4,
    flexDirection: "row",
    gap: theme.spacing.s3,
    alignItems: "center",
    backgroundColor: theme.functional.dangerSoft,
    borderColor: theme.functional.dangerBorder,
  },
  toxicTexts: {
    flex: 1,
    gap: 1,
  },
  toxicTitle: {
    ...type.sectionTitle,
    color: theme.functional.danger,
  },
  toxicText: {
    ...type.bodySm,
    color: theme.text.primary,
  },
  routinePreview: {
    width: "100%",
    marginTop: theme.spacing.s4,
  },
  groupsLabel: {
    ...type.label,
    color: theme.text.secondary,
    marginTop: theme.spacing.s5,
  },
  savedCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.s3,
    marginTop: theme.spacing.s4,
    paddingVertical: theme.spacing.s3,
    paddingHorizontal: theme.spacing.s4,
    backgroundColor: theme.secondary.mossSoft,
    borderRadius: theme.radius.md,
  },
  savedTexts: {
    flex: 1,
    gap: 1,
  },
  savedTitle: {
    ...type.sectionTitle,
    color: theme.secondary.moss,
  },
  savedAction: {
    ...type.bodySm,
    color: theme.text.primary,
  },
  groupChips: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: theme.spacing.s2,
    marginTop: theme.spacing.s4,
  },
  groupConfirm: {
    marginTop: theme.spacing.s5,
  },
  report: {
    marginTop: theme.spacing.s7,
  },
  reportLead: {
    ...type.bodySm,
    textAlign: "center",
  },
  reportAction: {
    ...type.bodySm,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 3,
    color: theme.primary.clay,
  },
  footer: {
    paddingHorizontal: theme.screenPadding,
    paddingBottom: theme.spacing.s5,
    paddingTop: theme.spacing.s3,
    gap: theme.spacing.s2,
    backgroundColor: theme.surface.base,
    borderTopWidth: 1,
    borderTopColor: theme.functional.line,
  },
});
