import { Redirect, Stack } from "expo-router";

import { useAppTheme, useAuthSession } from "@/components";

// TODO: Find a better way to manage the async storage
const AppLayout = () => {
  const theme = useAppTheme();
  const { auth } = useAuthSession();

  if (auth === undefined) {
    return null;
  }

  if (!auth) return <Redirect href="/sign-in" />;

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false, navigationBarColor: theme.colors.elevation.level2 }} />
      <Stack.Screen name="anime/details/[id]" />
      <Stack.Screen name="anime/edit/[id]" />
      <Stack.Screen name="search" options={{ headerShown: false }} />
    </Stack>
  );
};

export { ErrorBoundary } from "expo-router";

export default AppLayout;
