import { StyleSheet } from "react-native";

import { theme } from "@/style/theme";
import { fontSize, type } from "@/style/typography";

export const HEADER_PHOTO = 300;

export const styles = StyleSheet.create({
  routineUpsell: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.s2,
    marginTop: theme.spacing.s3,
    paddingVertical: theme.spacing.s3,
    paddingLeft: theme.spacing.s3,
    paddingRight: theme.spacing.s4,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.functional.line,
    backgroundColor: theme.surface.container,
  },
  routineUpsellText: {
    flex: 1,
    fontSize: fontSize.s5,
    fontWeight: "500",
    color: theme.secondary.ochre,
  },
  flex: {
    flex: 1,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  hero: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: HEADER_PHOTO,
    backgroundColor: theme.surface.photo,
  },
  heroFallback: {
    ...StyleSheet.absoluteFillObject,
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
    height: 52,
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
  nickname: {
    ...type.display,
    marginTop: theme.spacing.s2,
  },
  species: {
    ...type.bodySm,
    fontStyle: "italic",
    marginTop: 2,
  },
  waterCard: {
    marginTop: theme.spacing.s5,
    gap: theme.spacing.s4,
  },
  waterHead: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.s3,
  },
  waterTexts: {
    flex: 1,
    gap: 1,
  },
  waterHint: {
    ...type.bodySm,
    marginTop: 2,
  },
  waterValue: {
    ...type.displayXs,
  },
  section: {
    marginTop: theme.spacing.s6,
  },
  sectionTitle: {
    ...type.displayXs,
    marginTop: theme.spacing.s2,
  },
  infoCard: {
    marginTop: theme.spacing.s4,
  },
  sectionHint: {
    ...type.bodySm,
    marginTop: 2,
  },
  routine: {
    marginTop: theme.spacing.s3,
  },
  careCard: {
    marginTop: theme.spacing.s3,
    paddingVertical: theme.spacing.s2,
  },
  careRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: theme.spacing.s4,
    paddingVertical: theme.spacing.s4,
    borderBottomWidth: 1,
    borderBottomColor: theme.functional.line,
  },
  careRowLast: {
    borderBottomWidth: 0,
  },
  careIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.primary.clayTint,
    borderWidth: 1,
    borderColor: theme.primary.clayBorder,
  },
  careTexts: {
    flex: 1,
    gap: 2,
    paddingTop: 2,
  },
  careLabel: {
    fontSize: fontSize.s1,
    letterSpacing: 1.1,
    textTransform: "uppercase",
    color: theme.text.tertiary,
  },
  careNote: {
    ...type.bodySm,
    marginTop: 1,
  },
  careValue: {
    ...type.sectionTitle,
    fontSize: fontSize.s7,
  },
  historyCard: {
    marginTop: theme.spacing.s3,
    paddingVertical: theme.spacing.s2,
  },
  event: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.s3,
    paddingVertical: theme.spacing.s3,
  },
  eventKind: {
    flex: 1,
    ...type.body,
    color: theme.text.primary,
  },
  eventDate: {
    fontSize: fontSize.s3,
    color: theme.text.tertiary,
  },
  empty: {
    ...type.bodySm,
    paddingVertical: theme.spacing.s3,
  },
  analysis: {
    marginTop: theme.spacing.s4,
  },
  analysisDate: {
    fontSize: fontSize.s3,
    color: theme.text.tertiary,
  },
  resolvedRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.s3,
    paddingVertical: theme.spacing.s3,
  },
  resolvedText: {
    flex: 1,
    ...type.bodySm,
    color: theme.text.tertiary,
    textDecorationLine: "line-through",
  },
  resolvedDate: {
    fontSize: fontSize.s2,
    color: theme.text.tertiary,
  },
  newAnalysis: {
    marginTop: theme.spacing.s4,
  },
  resolveButton: {
    marginTop: theme.spacing.s3,
  },
  carousel: {
    paddingHorizontal: theme.screenPadding,
    gap: theme.spacing.s3,
    paddingTop: theme.spacing.s3,
  },
  toxic: {
    marginTop: theme.spacing.s6,
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
  menuCard: {
    marginTop: theme.spacing.s3,
    padding: 0,
    overflow: "hidden",
  },
});
