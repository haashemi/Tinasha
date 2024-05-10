import { createContext, useContext, useEffect, useMemo } from "react";
import { Appearance, ColorSchemeName, useColorScheme as useNativeColorScheme } from "react-native";

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

  const setScheme = (newScheme: "dark" | "light" | null) => {
    setColorScheme(newScheme);
    Appearance.setColorScheme(newScheme);
  };

  useEffect(() => Appearance.setColorScheme(preferredScheme), [preferredScheme]);

  return <Context.Provider value={{ scheme, preferredScheme, setScheme }}>{children}</Context.Provider>;
};
