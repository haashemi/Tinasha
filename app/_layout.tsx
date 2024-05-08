import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Sentry from "@sentry/react-native";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { isRunningInExpoGo } from "expo";
import * as NavigationBar from "expo-navigation-bar";
import { Stack, useNavigationContainerRef } from "expo-router";
import { PropsWithChildren, useEffect } from "react";
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

const routingInstrumentation = new Sentry.ReactNavigationInstrumentation();

Sentry.init({
  enabled: process.env.EXPO_PUBLIC_USE_SENTRY === "true",
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  debug: process.env.NODE_ENV === "development",
  enableAutoPerformanceTracing: true,
  integrations: [
    new Sentry.ReactNativeTracing({
      routingInstrumentation,
      enableNativeFramesTracking: !isRunningInExpoGo(),
    }),
  ],
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

const RootLayout = () => {
  const ref = useNavigationContainerRef();

  useEffect(() => {
    if (ref) routingInstrumentation.registerNavigationContainer(ref);
  }, [ref]);

  return (
    <Providers>
      <Stacks />
    </Providers>
  );
};

export { ErrorBoundary } from "expo-router";

export default Sentry.wrap(RootLayout);
