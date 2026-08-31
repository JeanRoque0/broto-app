import * as WebBrowser from "expo-web-browser";
import { StyleProp, StyleSheet, TextStyle } from "react-native";

import { Text } from "@/components/ui/Text";
import { theme } from "@/style/theme";

const TOKEN =
  /\*\*(\S(?:[^*]*\S)?)\*\*|\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)|(https?:\/\/[^\s<>"']+|\bwww\.[^\s<>"']+)/g;

const TRAILING = /[.,;:!?)\]}"']+$/;

type Segment = {
  text: string;
  bold?: boolean;
  href?: string;
};

type RichTextProps = {
  content: string;
  style?: StyleProp<TextStyle>;
};

function open(href: string) {
  const url = href.startsWith("http") ? href : `https://${href}`;

  WebBrowser.openBrowserAsync(url, {
    presentationStyle: WebBrowser.WebBrowserPresentationStyle.PAGE_SHEET,
    controlsColor: theme.primary.clay,
    toolbarColor: theme.surface.base,
    dismissButtonStyle: "close",
  }).catch(() => undefined);
}

function segmentsOf(content: string): Segment[] {
  const segments: Segment[] = [];
  let cursor = 0;

  for (const match of content.matchAll(TOKEN)) {
    const start = match.index ?? 0;

    if (start > cursor) {
      segments.push({ text: content.slice(cursor, start) });
    }

    cursor = start + match[0].length;

    if (match[1]) {
      segments.push({ text: match[1], bold: true });
      continue;
    }

    if (match[2] && match[3]) {
      segments.push({ text: match[2], href: match[3] });
      continue;
    }

    const raw = match[4] ?? "";
    const tail = raw.match(TRAILING)?.[0] ?? "";
    const href = tail ? raw.slice(0, -tail.length) : raw;

    segments.push({ text: href, href });
    if (tail) segments.push({ text: tail });
  }

  if (cursor < content.length) {
    segments.push({ text: content.slice(cursor) });
  }

  return segments;
}

export function RichText({ content, style }: RichTextProps) {
  const segments = segmentsOf(content);

  if (!segments.some((segment) => segment.bold || segment.href)) {
    return <Text style={style}>{content}</Text>;
  }

  return (
    <Text style={style}>
      {segments.map((segment, index) => {
        if (segment.href) {
          return (
            <Text
              key={index}
              style={styles.link}
              onPress={() => open(segment.href!)}
              accessibilityRole="link"
            >
              {segment.text}
            </Text>
          );
        }

        if (segment.bold) {
          return (
            <Text key={index} style={styles.bold}>
              {segment.text}
            </Text>
          );
        }

        return segment.text;
      })}
    </Text>
  );
}

const styles = StyleSheet.create({
  bold: {
    fontWeight: "700",
  },
  link: {
    color: theme.primary.clay,
    fontWeight: "500",
    textDecorationLine: "underline",
  },
});
