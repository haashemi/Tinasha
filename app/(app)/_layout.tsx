import { Redirect, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

import { useAppTheme, useAuthSession } from "@/components";

SplashScreen.preventAutoHideAsync();

const AppLayout = () => {
  const theme = useAppTheme();
  const { auth } = useAuthSession();

  useEffect(() => {
    if (auth === undefined) return;

    const hideSplashScreen = async () => {
      await SplashScreen.hideAsync();
    };
    hideSplashScreen();
  }, [auth]);

  if (auth === undefined) return null;
  if (!auth) return <Redirect href="/sign-in" />;

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false, navigationBarColor: theme.colors.elevation.level2 }} />
      <Stack.Screen name="anime/[id]" />
      <Stack.Screen name="anime/edit" />
      <Stack.Screen name="search" options={{ headerShown: false }} />
    </Stack>
  );
};

export { ErrorBoundary } from "expo-router";

export default AppLayout;
