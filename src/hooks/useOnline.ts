import * as Network from "expo-network";
import { useEffect, useState } from "react";

export function useOnline() {
  const [online, setOnline] = useState(true);

  useEffect(() => {
    let alive = true;

    Network.getNetworkStateAsync()
      .then((state) => {
        if (alive) setOnline(state.isInternetReachable !== false);
      })
      .catch(() => undefined);

    const subscription = Network.addNetworkStateListener((state) => {
      setOnline(state.isInternetReachable !== false);
    });

    return () => {
      alive = false;
      subscription.remove();
    };
  }, []);

  return online;
}
