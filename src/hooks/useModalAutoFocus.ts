import { useCallback, useEffect, useRef } from "react";
import { Platform, TextInput } from "react-native";

const SETTLE_DELAY = Platform.OS === "android" ? 150 : 60;
const RETRY_DELAY = 180;

export function useModalAutoFocus() {
  const ref = useRef<TextInput>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clear = useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  }, []);

  const onShow = useCallback(() => {
    clear();

    timer.current = setTimeout(() => {
      ref.current?.focus();

      timer.current = setTimeout(() => {
        if (!ref.current?.isFocused()) ref.current?.focus();
      }, RETRY_DELAY);
    }, SETTLE_DELAY);
  }, [clear]);

  useEffect(() => clear, [clear]);

  return { ref, onShow, cancelAutoFocus: clear };
}
