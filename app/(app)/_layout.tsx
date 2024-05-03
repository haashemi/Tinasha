import { Redirect, Stack } from "expo-router";

import { useAppTheme, useAuthSession } from "@/components";

export { ErrorBoundary } from "expo-router";

export default function AppLayout() {
  const theme = useAppTheme();
  const { auth } = useAuthSession();

  if (!auth) return <Redirect href="/sign-in" />;

  return (
    <Stack screenOptions={{ navigationBarColor: theme.colors.background }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false, navigationBarColor: theme.colors.elevation.level2 }} />
      <Stack.Screen name="anime/details/[id]" />
      <Stack.Screen name="anime/edit/[id]" />
      <Stack.Screen name="search" options={{ headerShown: false }} />
    </Stack>
  );
}
