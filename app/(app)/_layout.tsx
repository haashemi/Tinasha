import { Redirect, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

import { LoadingScreen } from "@/components";
import { useAppTheme, useAuthSession } from "@/context";

void SplashScreen.preventAutoHideAsync();

const AppLayout = () => {
  const theme = useAppTheme();
  const { auth } = useAuthSession();

  useEffect(() => {
    if (auth === undefined) return;

    void SplashScreen.hideAsync();
  }, [auth]);

  if (auth === undefined) return <LoadingScreen />;
  if (!auth) return <Redirect href="/sign-in" />;

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false, navigationBarColor: theme.colors.elevation.level2 }} />

      <Stack.Screen name="anime/[id]/index" options={{ headerTitle: "Anime Details" }} />
      <Stack.Screen name="anime/[id]/[title]/pics" options={{ presentation: "transparentModal", animation: "fade" }} />

      <Stack.Screen name="settings/nsfw" options={{ headerTitle: "NSFW Settings" }} />
    </Stack>
  );
};

export { ErrorBoundary } from "expo-router";

export default AppLayout;
