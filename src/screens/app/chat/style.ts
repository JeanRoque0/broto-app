import { StyleSheet } from "react-native";

import { theme } from "@/style/theme";
import { fontSize, type } from "@/style/typography";

export const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  list: {
    flexGrow: 1,
    paddingHorizontal: theme.screenPadding,
    paddingTop: theme.spacing.s4,
  },
  bubbleRow: {
    marginBottom: theme.spacing.s3,
  },
  botRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: theme.spacing.s2,
  },
  bubble: {
    maxWidth: "86%",
    paddingVertical: theme.spacing.s3,
    paddingHorizontal: theme.spacing.s4,
    borderRadius: theme.radius.lg,
  },
  fromUser: {
    alignSelf: "flex-end",
    backgroundColor: theme.secondary.mossSoft,
    borderBottomRightRadius: 4,
  },
  fromBot: {
    alignSelf: "flex-start",
    backgroundColor: theme.surface.card,
    borderWidth: 1,
    borderColor: theme.functional.line,
    borderBottomLeftRadius: 4,
  },
  bubbleText: {
    fontSize: fontSize.s6,
    lineHeight: 22,
    color: theme.text.primary,
  },
  thinking: {
    ...type.bodySm,
    color: theme.text.tertiary,
  },
  typing: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: theme.spacing.s2,
    marginBottom: theme.spacing.s3,
  },
  locked: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.s2,
    paddingHorizontal: theme.screenPadding,
  },
  lockedTitle: {
    ...type.displayXs,
    textAlign: "center",
    marginTop: theme.spacing.s4,
  },
  lockedActions: {
    alignSelf: "stretch",
    gap: theme.spacing.s3,
    marginTop: theme.spacing.s5,
  },
  failed: {
    ...type.bodySm,
    color: theme.functional.danger,
    textAlign: "center",
    marginBottom: theme.spacing.s3,
  },
  introText: {
    ...type.bodySm,
    textAlign: "center",
  },
  menuCard: {
    padding: 0,
    marginTop: theme.spacing.s5,
  },
  gauges: {
    gap: theme.spacing.s4,
    marginTop: theme.spacing.s6,
  },
  gaugeHint: {
    ...type.bodySm,
    marginTop: theme.spacing.s3,
  },
  composer: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: theme.spacing.s2,
    paddingHorizontal: theme.screenPadding,
    paddingTop: theme.spacing.s3,
    borderTopWidth: 1,
    borderTopColor: theme.functional.line,
    backgroundColor: theme.surface.base,
  },
  field: {
    flex: 1,
    minHeight: 40,
    maxHeight: 120,
    paddingTop: theme.spacing.s2,
    paddingBottom: theme.spacing.s2,
    paddingHorizontal: theme.spacing.s4,
    borderRadius: theme.radius.lg,
    borderWidth: 1.5,
    borderColor: theme.functional.line,
    backgroundColor: theme.surface.card,
    fontSize: fontSize.s6,
    lineHeight: 21,
    color: theme.text.primary,
  },
  fieldFocused: {
    borderColor: theme.secondary.moss,
    backgroundColor: theme.secondary.mossSoft,
  },
  send: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.secondary.moss,
  },
  sendOff: {
    backgroundColor: theme.functional.line,
  },
  threadsLoading: {
    paddingVertical: theme.spacing.s6,
  },
  threadList: {
    marginTop: theme.spacing.s4,
    marginHorizontal: -theme.spacing.s2,
  },
  threadRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.s3,
    paddingVertical: theme.spacing.s3,
    paddingLeft: theme.spacing.s3,
    paddingRight: theme.spacing.s2,
    marginBottom: theme.spacing.s1,
    borderRadius: theme.radius.md,
    backgroundColor: theme.surface.card,
    borderWidth: 1,
    borderColor: theme.functional.line,
  },
  threadActive: {
    borderColor: theme.secondary.moss,
    backgroundColor: theme.secondary.mossSoft,
  },
  threadTexts: {
    flex: 1,
    gap: 3,
  },
  threadTitle: {
    fontSize: fontSize.s6,
    lineHeight: 19,
    color: theme.text.primary,
  },
  threadDate: {
    fontSize: fontSize.s2,
    color: theme.text.tertiary,
  },
  threadConfirm: {
    flexDirection: "row",
    gap: theme.spacing.s1,
  },
  threadIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.surface.container,
  },
  threadIconTrash: {
    backgroundColor: theme.functional.dangerSoft,
  },
  threadIconDanger: {
    backgroundColor: theme.functional.danger,
  },
  newThread: {
    marginTop: theme.spacing.s4,
  },
});
