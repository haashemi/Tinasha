import { createContext, useCallback, useContext, useMemo } from "react";
import type { ColorSchemeName } from "react-native";
import { useColorScheme as useNativeColorScheme } from "react-native";

import { useAsyncStorage } from "@/hooks";

const Context = createContext<{
  scheme: ColorSchemeName;
  preferredScheme: ColorSchemeName;
  setScheme: (newScheme: "dark" | "light" | null) => void;
}>({
  scheme: null,
  preferredScheme: "dark",
  setScheme: () => null,
});

export const useColorScheme = () => useContext(Context);

export const ColorSchemeProvider = ({ children }: { children: React.ReactNode }) => {
  const systemColorScheme = useNativeColorScheme();
  const [colorScheme, setColorScheme] = useAsyncStorage("colorScheme");

  const scheme = colorScheme as ColorSchemeName;
  const preferredScheme = useMemo(() => scheme ?? systemColorScheme, [scheme, systemColorScheme]);

  const setScheme = useCallback((newScheme: "dark" | "light" | null) => setColorScheme(newScheme), [setColorScheme]);

  const values = useMemo(() => ({ scheme, preferredScheme, setScheme }), [preferredScheme, scheme, setScheme]);

  return <Context.Provider value={values}>{children}</Context.Provider>;
};
