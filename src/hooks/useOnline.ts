import * as Network from "expo-network";
import { useSyncExternalStore } from "react";
import { AppState } from "react-native";

type State = {
  isConnected?: boolean | null;
  isInternetReachable?: boolean | null;
};

let online = true;
let started = false;
const listeners = new Set<() => void>();

function reachable(state: State) {
  if (state.isInternetReachable === false) return false;
  return state.isConnected !== false;
}

function publish(next: boolean) {
  if (next === online) return;
  online = next;
  listeners.forEach((listener) => listener());
}

function check() {
  Network.getNetworkStateAsync()
    .then((state) => publish(reachable(state)))
    .catch(() => undefined);
}

function start() {
  if (started) return;
  started = true;

  check();
  Network.addNetworkStateListener((state) => publish(reachable(state)));

  AppState.addEventListener("change", (status) => {
    if (status === "active") check();
  });
}

function subscribe(listener: () => void) {
  start();
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

export function useOnline() {
  return useSyncExternalStore(
    subscribe,
    () => online,
    () => true,
  );
}
