import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import * as NavigationBar from "expo-navigation-bar";
import { Stack } from "expo-router";
import type { PropsWithChildren } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { en, registerTranslation } from "react-native-paper-dates";

import {
  AppThemeProvider,
  AuthSessionProvider,
  ColorSchemeProvider,
  NSFWProvider,
  QueryClientProvider,
} from "@/context";

void NavigationBar.setPositionAsync("absolute");
void NavigationBar.setBackgroundColorAsync("transparent");
void NavigationBar.setButtonStyleAsync("light");
registerTranslation("en", en);

const Providers = ({ children }: PropsWithChildren) => (
  <QueryClientProvider>
    <ColorSchemeProvider>
      <AppThemeProvider>
        <AuthSessionProvider>
          <NSFWProvider>
            <GestureHandlerRootView style={{ flex: 1 }}>
              <BottomSheetModalProvider>{children}</BottomSheetModalProvider>
            </GestureHandlerRootView>
          </NSFWProvider>
        </AuthSessionProvider>
      </AppThemeProvider>
    </ColorSchemeProvider>
  </QueryClientProvider>
);

const RootLayout = () => {
  return (
    <Providers>
      <Stack screenOptions={{ headerShown: false, navigationBarColor: "transparent", animation: "fade" }}>
        <Stack.Screen name="(app)" />
        <Stack.Screen name="sign-in" />
      </Stack>
    </Providers>
  );
};

export { ErrorBoundary } from "expo-router";

export default RootLayout;
