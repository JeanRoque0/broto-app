import { Image } from "expo-image";
import React from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";

import { usePhotoUrl } from "@/hooks/usePhotoUrl";
import { theme } from "@/style/theme";

type PlantPhotoProps = {
  path: string | null;
  uri?: string | null;
  fallback?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function PlantPhoto({ path, uri, fallback, style }: PlantPhotoProps) {
  const { data: signed } = usePhotoUrl(uri ? null : path);
  const url = uri ?? signed;

  return (
    <View style={[styles.container, style]}>
      {url ? (
        <Image
          source={{ uri: url, cacheKey: path ?? url }}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          cachePolicy="memory-disk"
          recyclingKey={path ?? url}
          transition={200}
        />
      ) : (
        fallback
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    backgroundColor: theme.surface.photo,
    alignItems: "center",
    justifyContent: "center",
  },
});
