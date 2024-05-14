import * as SecureStore from "expo-secure-store";
import { useCallback, useEffect, useState } from "react";

const useSecureStorage = (key: string, defaultValue?: string) => {
  const [state, setState] = useState<string | null | undefined>(defaultValue);

  useEffect(() => {
    const getStoredValue = async () => {
      const storedValue = await SecureStore.getItemAsync(key);
      setState(storedValue);
    };

    void getStoredValue();
  }, [key]);

  const setValue = useCallback(
    (value: string | null) => {
      setState(value);

      if (value === null) {
        void SecureStore.deleteItemAsync(key);
      } else {
        void SecureStore.setItemAsync(key, value);
      }
    },
    [key],
  );

  return [state, setValue] as const;
};

export default useSecureStorage;
