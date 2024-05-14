import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";

const useAsyncStorage = (key: string, defaultValue?: string) => {
  const [state, setState] = useState<string | null | undefined>(defaultValue);

  useEffect(() => {
    const getStoredValue = async () => {
      const storedValue = await AsyncStorage.getItem(key);
      setState(storedValue);
    };

    void getStoredValue();
  }, [key]);

  const setValue = useCallback(
    (value: string | null) => {
      setState(value);

      if (value === null) {
        void AsyncStorage.removeItem(key);
      } else {
        void AsyncStorage.setItem(key, value);
      }
    },
    [key],
  );

  return [state, setValue] as const;
};

export default useAsyncStorage;
