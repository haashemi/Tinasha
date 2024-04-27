import { Material3Scheme, useMaterial3Theme } from "@pchmn/expo-material3-theme";
import { setBackgroundColorAsync } from "expo-system-ui";
import { useEffect, useMemo } from "react";
import { useColorScheme } from "react-native";
import {
  MD3DarkTheme,
  MD3LightTheme,
  MD3Theme,
  Provider as PaperProvider,
  ProviderProps,
  useTheme,
} from "react-native-paper";

interface M3ThemeProviderProps extends ProviderProps {
  sourceColor?: string;
  fallbackSourceColor?: string;
}

export const useAppTheme = useTheme<MD3Theme & { colors: Material3Scheme }>;

export function M3ThemeProvider({ children, sourceColor, fallbackSourceColor, ...otherProps }: M3ThemeProviderProps) {
  const colorScheme = useColorScheme();

  const { theme } = useMaterial3Theme({ sourceColor, fallbackSourceColor });

  const paperTheme = useMemo(
    () =>
      colorScheme === "dark" ? { ...MD3DarkTheme, colors: theme.dark } : { ...MD3LightTheme, colors: theme.light },
    [colorScheme, theme.dark, theme.light],
  );

  useEffect(() => {
    setBackgroundColorAsync(paperTheme.colors.background);
  }, [paperTheme]);

  return (
    <PaperProvider theme={paperTheme} {...otherProps}>
      {children}
    </PaperProvider>
  );
}
