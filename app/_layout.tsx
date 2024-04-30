import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { PropsWithChildren } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { AuthSessionProvider, ThemeProvider, useAppTheme } from "@/components";

const queryClient = new QueryClient({});

export { ErrorBoundary } from "expo-router";

const Providers = ({ children }: PropsWithChildren) => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <BottomSheetModalProvider>
          <AuthSessionProvider>{children}</AuthSessionProvider>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </ThemeProvider>
  </QueryClientProvider>
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

export default function RootLayout() {
  return (
    <Providers>
      <Stacks />
    </Providers>
  );
}
