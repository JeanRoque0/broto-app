import { useFocusEffect } from "expo-router";
import { StatusBarStyle, setStatusBarStyle } from "expo-status-bar";
import { useCallback } from "react";

export function useStatusBarStyle(style: StatusBarStyle) {
  useFocusEffect(
    useCallback(() => {
      setStatusBarStyle(style);
    }, [style]),
  );
}
