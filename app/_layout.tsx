import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import * as NavigationBar from "expo-navigation-bar";
import { Stack } from "expo-router";
import type { PropsWithChildren } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { AppThemeProvider, AuthSessionProvider, ColorSchemeProvider } from "@/context";

void NavigationBar.setPositionAsync("absolute");
void NavigationBar.setBackgroundColorAsync("#000000");
void NavigationBar.setButtonStyleAsync("light");

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
      staleTime: 1_800_000, // 30 minutes
    },
  },
});

const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage,
});

const Providers = ({ children }: PropsWithChildren) => (
  <PersistQueryClientProvider client={queryClient} persistOptions={{ persister: asyncStoragePersister }}>
    <ColorSchemeProvider>
      <AppThemeProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <BottomSheetModalProvider>
            <AuthSessionProvider>{children}</AuthSessionProvider>
          </BottomSheetModalProvider>
        </GestureHandlerRootView>
      </AppThemeProvider>
    </ColorSchemeProvider>
  </PersistQueryClientProvider>
);

const Stacks = () => (
  <Stack screenOptions={{ headerShown: false, navigationBarColor: "transparent", animation: "fade" }}>
    <Stack.Screen name="(app)" />
    <Stack.Screen name="sign-in" />
    {/* <Stack.Screen name="+not-found" /> */}
  </Stack>
);

const RootLayout = () => {
  return (
    <Providers>
      <Stacks />
    </Providers>
  );
};

export { ErrorBoundary } from "expo-router";

export default RootLayout;
