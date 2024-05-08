import { Material3Scheme, useMaterial3Theme } from "@pchmn/expo-material3-theme";
import { ThemeProvider as ReactNavigateProvider, Theme } from "@react-navigation/native";
import * as SystemUI from "expo-system-ui";
import { useEffect } from "react";
import {
  MD3DarkTheme,
  MD3LightTheme,
  MD3Theme,
  Provider as PaperProvider,
  ProviderProps,
  useTheme,
} from "react-native-paper";

import { useColorScheme } from "./ColorSchemeProvider";

interface ThemeProviderProps extends ProviderProps {
  sourceColor?: string;
  fallbackSourceColor?: string;
}

export const useAppTheme = useTheme<MD3Theme & { colors: Material3Scheme }>;

export function ThemeProvider({ children, sourceColor, fallbackSourceColor, ...props }: ThemeProviderProps) {
  const { preferredScheme } = useColorScheme();
  const { theme } = useMaterial3Theme({ sourceColor, fallbackSourceColor });

  const paperTheme =
    preferredScheme === "dark" ? { ...MD3DarkTheme, colors: theme.dark } : { ...MD3LightTheme, colors: theme.light };

  const routerTheme: Theme = {
    colors: {
      primary: paperTheme.colors.primary,
      background: paperTheme.colors.background,
      card: paperTheme.colors.elevation.level2,
      text: paperTheme.colors.onSurface,
      border: paperTheme.colors.outline,
      notification: paperTheme.colors.error,
    },
    dark: preferredScheme === "dark",
  };

  useEffect(() => {
    SystemUI.setBackgroundColorAsync(paperTheme.colors.background);
  }, [paperTheme.colors.background]);

  return (
    <PaperProvider theme={paperTheme} {...props}>
      <ReactNavigateProvider value={routerTheme}>{children}</ReactNavigateProvider>
    </PaperProvider>
  );
}
