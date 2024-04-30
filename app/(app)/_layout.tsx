import { Stack } from "expo-router";

import { useAppTheme } from "@/components";

export { ErrorBoundary } from "expo-router";

export default function RootLayout() {
  const { colors } = useAppTheme();

  // TODO: Auth Guard here

  return (
    <Stack screenOptions={{ headerShown: false, navigationBarColor: colors.background }}>
      <Stack.Screen name="(tabs)" options={{ navigationBarColor: colors.elevation.level2 }} />
      <Stack.Screen name="search" options={{ presentation: "modal" }} />
    </Stack>
  );
}
