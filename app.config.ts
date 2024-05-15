import type { ConfigContext, ExpoConfig } from "expo/config";
import type { PluginConfigType as BuildPropertiesConfigType } from "expo-build-properties/build/pluginConfig";

const IS_DEV = process.env["APP_VARIANT"] === "development";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: IS_DEV ? "Tinasha (Dev)" : "Tinasha",
  description: "",
  slug: "tinasha",
  owner: "haashemi",
  privacy: "public",
  version: "0.2.3",
  platforms: ["android"],
  githubUrl: "https://github.com/haashemi/Tinasha",
  orientation: "portrait",
  userInterfaceStyle: "automatic",
  backgroundColor: "#0f172a",
  icon: "./assets/images/icon.png",
  androidStatusBar: {
    barStyle: "light-content",
    backgroundColor: "#0f172a",
  },
  androidNavigationBar: {
    barStyle: "light-content",
    backgroundColor: "#0f172a",
  },
  developmentClient: { silentLaunch: true },
  scheme: "tinasha",
  plugins: [
    "expo-router",
    "expo-secure-store",
    [
      "expo-build-properties",
      {
        android: {
          enableProguardInReleaseBuilds: true,
          enableShrinkResourcesInReleaseBuilds: true,
          useLegacyPackaging: true,
        },
      } as BuildPropertiesConfigType,
    ],
  ],
  splash: {
    image: "./assets/images/splash.png",
    backgroundColor: "#0f172a",
  },
  android: {
    package: IS_DEV ? "dev.haashemi.tinasha.dev" : "dev.haashemi.tinasha",
    versionCode: 1,
    userInterfaceStyle: "automatic",
    adaptiveIcon: {
      foregroundImage: "./assets/images/adaptive-icon.png",
      backgroundColor: "#0f172a",
    },
    intentFilters: [
      {
        action: "VIEW",
        autoVerify: true,
        data: [{ scheme: "https", host: "myanimelist.net", pathPrefix: "/anime/" }],
        category: ["BROWSABLE", "DEFAULT"],
      },
    ],
    softwareKeyboardLayoutMode: "pan",
  },
  experiments: { tsconfigPaths: true, typedRoutes: true, turboModules: true },
  extra: {
    router: { origin: false },
    eas: { projectId: "20bb87cb-0cc2-4c74-bc1e-55c4c48f8158" },
  },
  updates: {
    url: "https://u.expo.dev/20bb87cb-0cc2-4c74-bc1e-55c4c48f8158",
  },
  runtimeVersion: {
    policy: "appVersion",
  },
});
