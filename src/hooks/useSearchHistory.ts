import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";

const KEY = "broto.search.history";
const LIMIT = 8;

export function useSearchHistory() {
  const [items, setItems] = useState<string[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(KEY).then((stored) => {
      if (!stored) return;
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) setItems(parsed.slice(0, LIMIT));
      } catch {
        setItems([]);
      }
    });
  }, []);

  const persist = useCallback((next: string[]) => {
    setItems(next);
    AsyncStorage.setItem(KEY, JSON.stringify(next));
  }, []);

  const remember = useCallback((term: string) => {
    const clean = term.trim();
    if (clean.length < 3) return;

    setItems((current) => {
      const next = [
        clean,
        ...current.filter((item) => item.toLowerCase() !== clean.toLowerCase()),
      ].slice(0, LIMIT);

      AsyncStorage.setItem(KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const forget = useCallback(
    (term: string) => {
      persist(items.filter((item) => item !== term));
    },
    [items, persist],
  );

  return { items, remember, forget };
}
