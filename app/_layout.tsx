import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import * as NavigationBar from "expo-navigation-bar";
import { Stack } from "expo-router";
import { PropsWithChildren } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { AuthSessionProvider, ThemeProvider } from "@/components";

NavigationBar.setPositionAsync("absolute");
NavigationBar.setBackgroundColorAsync("#000000");
NavigationBar.setButtonStyleAsync("light");

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
    <ThemeProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <BottomSheetModalProvider>
          <AuthSessionProvider>{children}</AuthSessionProvider>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </ThemeProvider>
  </PersistQueryClientProvider>
);

const Stacks = () => (
  <Stack screenOptions={{ headerShown: false, navigationBarColor: "transparent", animation: "fade" }}>
    <Stack.Screen name="(app)" />
    <Stack.Screen name="sign-in" />
    {/* <Stack.Screen name="+not-found" /> */}
  </Stack>
);

export { ErrorBoundary } from "expo-router";

export default function RootLayout() {
  return (
    <Providers>
      <Stacks />
    </Providers>
  );
}
