import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { ThemeProvider, useAppTheme } from "@/components";

export { ErrorBoundary } from "expo-router";

const queryClient = new QueryClient({});

const Stacks = () => {
  const { colors } = useAppTheme();
  return (
    <Stack
      screenOptions={{ headerShown: false, navigationBarColor: colors.elevation.level2, contentStyle: { flex: 1 } }}
    >
      <Stack.Screen name="(tabs)" options={{}} />
      <Stack.Screen name="search" options={{ presentation: "modal", navigationBarColor: colors.background }} />
      {/* <Stack.Screen name="login" options={{ headerShown: false, navigationBarColor: colors.elevation.level2 }} /> */}
    </Stack>
  );
};

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <BottomSheetModalProvider>
            <Stacks />
          </BottomSheetModalProvider>
        </GestureHandlerRootView>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
