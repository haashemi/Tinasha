import type { Material3Scheme } from "@pchmn/expo-material3-theme";
import { useMaterial3Theme } from "@pchmn/expo-material3-theme";
import type { Theme } from "@react-navigation/native";
import { ThemeProvider as ReactNavigateProvider } from "@react-navigation/native";
import type { MD3Theme, ProviderProps } from "react-native-paper";
import { MD3DarkTheme, MD3LightTheme, Provider as PaperProvider, useTheme } from "react-native-paper";

import { useColorScheme } from "./ColorScheme";

interface AppThemeProviderProps extends ProviderProps {
  sourceColor?: string;
  fallbackSourceColor?: string;
}

export const useAppTheme = useTheme<MD3Theme & { colors: Material3Scheme }>;

export const AppThemeProvider = ({ children, sourceColor, fallbackSourceColor, ...props }: AppThemeProviderProps) => {
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

  return (
    <PaperProvider theme={paperTheme} {...props}>
      <ReactNavigateProvider value={routerTheme}>{children}</ReactNavigateProvider>
    </PaperProvider>
  );
};
