import { createContext, useCallback, useContext, useEffect, useMemo } from "react";
import { Appearance, ColorSchemeName, useColorScheme as useNativeColorScheme } from "react-native";

import { useAsyncStorage } from "../hooks";

const Context = createContext<{
  scheme: ColorSchemeName;
  preferredScheme: ColorSchemeName;
  setScheme: (newScheme: "dark" | "light" | null) => void;
}>({
  scheme: null,
  preferredScheme: "dark",
  setScheme: () => null,
});

export const useColorScheme = () => {
  const value = useContext(Context);
  if (process.env.NODE_ENV !== "production") {
    if (!value) {
      throw new Error("useAuthSession must be wrapped in a <AuthSessionProvider />");
    }
  }

  return value;
};

export const ColorSchemeProvider = ({ children }: { children: React.ReactNode }) => {
  const systemColorScheme = useNativeColorScheme();
  const [colorScheme, setColorScheme] = useAsyncStorage("colorScheme");

  const scheme = colorScheme as ColorSchemeName;
  const preferredScheme = useMemo(() => scheme ?? systemColorScheme, [scheme, systemColorScheme]);

  const setScheme = useCallback(
    (newScheme: "dark" | "light" | null) => {
      Appearance.setColorScheme(newScheme);
      setColorScheme(newScheme);
    },
    [setColorScheme],
  );

  useEffect(() => Appearance.setColorScheme(preferredScheme), [preferredScheme]);

  return <Context.Provider value={{ scheme, preferredScheme, setScheme }}>{children}</Context.Provider>;
};
