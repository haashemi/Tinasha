import * as SecureStore from "expo-secure-store";
import { useCallback, useEffect, useState } from "react";

const useSecureStorage = (key: string, defaultValue?: string) => {
  const [state, setState] = useState<string | null | undefined>();

  useEffect(() => {
    const getStoredValue = async () => {
      const storedValue = await SecureStore.getItemAsync(key);

      if (!storedValue && defaultValue) {
        return SecureStore.setItemAsync(key, defaultValue);
      }

      setState(storedValue);
    };

    void getStoredValue();
  }, [defaultValue, key]);

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
