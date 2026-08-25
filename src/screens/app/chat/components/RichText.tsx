import { StyleProp, StyleSheet, TextStyle } from "react-native";

import { Text } from "@/components/ui/Text";

const BOLD = /\*\*(\S(?:[^*]*\S)?)\*\*/g;

type Segment = {
  text: string;
  bold: boolean;
};

type RichTextProps = {
  content: string;
  style?: StyleProp<TextStyle>;
};

function segmentsOf(content: string): Segment[] {
  const segments: Segment[] = [];
  let cursor = 0;

  for (const match of content.matchAll(BOLD)) {
    const start = match.index ?? 0;

    if (start > cursor) {
      segments.push({ text: content.slice(cursor, start), bold: false });
    }

    segments.push({ text: match[1], bold: true });
    cursor = start + match[0].length;
  }

  if (cursor < content.length) {
    segments.push({ text: content.slice(cursor), bold: false });
  }

  return segments;
}

export function RichText({ content, style }: RichTextProps) {
  const segments = segmentsOf(content);

  if (!segments.some((segment) => segment.bold)) {
    return <Text style={style}>{content}</Text>;
  }

  return (
    <Text style={style}>
      {segments.map((segment, index) =>
        segment.bold ? (
          <Text key={index} style={styles.bold}>
            {segment.text}
          </Text>
        ) : (
          segment.text
        ),
      )}
    </Text>
  );
}

const styles = StyleSheet.create({
  bold: {
    fontWeight: "700",
  },
});
