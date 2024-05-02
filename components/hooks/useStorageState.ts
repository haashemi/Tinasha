import * as SecureStore from "expo-secure-store";
import * as React from "react";

type UseStateHook<T> = [T | null, (value: T | null) => void];

export async function setStorageItemAsync(key: string, value: string | null) {
  if (value == null) return SecureStore.deleteItemAsync(key);
  return await SecureStore.setItemAsync(key, value);
}

export function useStorageState(key: string): UseStateHook<string> {
  const [state, setState] = React.useState<string | null>(null);

  // Get
  React.useEffect(() => {
    SecureStore.getItemAsync(key).then(setState);
  }, [key, setState]);

  // Set
  const setValue = React.useCallback(
    (value: string | null) => {
      setState(value);
      setStorageItemAsync(key, value);
    },
    [key, setState],
  );

  return [state, setValue];
}
