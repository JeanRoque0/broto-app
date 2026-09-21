import { View } from "react-native";

const anchors = new Map<string, View>();

export function registerAnchor(id: string, node: View | null) {
  if (node) anchors.set(id, node);
  else anchors.delete(id);
}

export function hasAnchor(id: string) {
  return anchors.has(id);
}

export type Rect = { x: number; y: number; width: number; height: number };

export function measureAnchor(id: string): Promise<Rect | null> {
  const node = anchors.get(id);
  if (!node) return Promise.resolve(null);

  return new Promise((resolve) => {
    node.measureInWindow((x, y, width, height) => {
      resolve(width > 0 && height > 0 ? { x, y, width, height } : null);
    });
  });
}
