import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { Stack } from "expo-router";
import { PropsWithChildren } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { AuthSessionProvider, ThemeProvider, useAppTheme } from "@/components";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
      staleTime: Infinity,
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

const Stacks = () => {
  const { colors } = useAppTheme();

  return (
    <Stack screenOptions={{ headerShown: false, navigationBarColor: colors.background }}>
      <Stack.Screen name="(app)" />
      <Stack.Screen name="sign-in" />
    </Stack>
  );
};

export { ErrorBoundary } from "expo-router";

export default function RootLayout() {
  return (
    <Providers>
      <Stacks />
    </Providers>
  );
}
