import { Redirect, Stack } from "expo-router";

import { useAppTheme, useAuthSession } from "@/components";

export { ErrorBoundary } from "expo-router";

export default function AppLayout() {
  const theme = useAppTheme();
  const { auth } = useAuthSession();

  if (!auth) return <Redirect href="/sign-in" />;

  return (
    <Stack screenOptions={{ headerShown: false, navigationBarColor: theme.colors.background }}>
      <Stack.Screen name="(tabs)" options={{ navigationBarColor: theme.colors.elevation.level2 }} />
      <Stack.Screen name="search" options={{ presentation: "modal" }} />
    </Stack>
  );
}
