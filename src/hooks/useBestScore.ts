import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";

export function useBestScore(game: string) {
  const key = `broto.game.${game}`;
  const [best, setBest] = useState(0);

  useEffect(() => {
    AsyncStorage.getItem(key).then((stored) => {
      if (stored) setBest(Number(stored) || 0);
    });
  }, [key]);

  const submit = useCallback(
    (value: number) => {
      setBest((current) => {
        if (value <= current) return current;
        AsyncStorage.setItem(key, String(value));
        return value;
      });
    },
    [key],
  );

  return { best, submit };
}
