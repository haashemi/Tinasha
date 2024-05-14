import { createContext, useCallback, useContext, useEffect, useMemo } from "react";
import type { ColorSchemeName } from "react-native";
import { Appearance, useColorScheme as useNativeColorScheme } from "react-native";

import { useAsyncStorage } from "../hooks";

interface ContextValues {
  scheme: ColorSchemeName;
  preferredScheme: ColorSchemeName;
  setScheme: (newScheme: "dark" | "light" | null) => void;
}

const Context = createContext<ContextValues>({ scheme: null, preferredScheme: "dark", setScheme: () => null });

export const useColorScheme = () => useContext(Context);

export const ColorSchemeProvider = ({ children }: { children: React.ReactNode }) => {
  const systemColorScheme = useNativeColorScheme();
  const [colorScheme, setColorScheme] = useAsyncStorage("colorScheme");

  const scheme = colorScheme as ColorSchemeName;
  const preferredScheme = useMemo(() => scheme ?? systemColorScheme, [scheme, systemColorScheme]);

  const setScheme = useCallback(
    (newScheme: "dark" | "light" | null) => {
      setColorScheme(newScheme);
      Appearance.setColorScheme(newScheme);
    },
    [setColorScheme],
  );

  useEffect(() => Appearance.setColorScheme(preferredScheme), [preferredScheme]);

  const values = useMemo(() => ({ scheme, preferredScheme, setScheme }), [preferredScheme, scheme, setScheme]);

  return <Context.Provider value={values}>{children}</Context.Provider>;
};
