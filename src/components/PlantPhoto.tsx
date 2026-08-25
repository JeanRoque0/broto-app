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
          source={{ uri: url }}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
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
