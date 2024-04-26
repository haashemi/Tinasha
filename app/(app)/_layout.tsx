import { Slot } from "expo-router";

import { Material3ThemeProvider } from "@/components/Material3ThemeProvider";

export { ErrorBoundary } from "expo-router";

export default function RootLayout() {
  return (
    <Material3ThemeProvider settings={{ rippleEffectEnabled: true }}>
      <Slot />
    </Material3ThemeProvider>
  );
}
