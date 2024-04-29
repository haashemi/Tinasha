import { ConfigContext, ExpoConfig } from "expo/config";

const IS_DEV = process.env.APP_VARIANT === "development";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: IS_DEV ? "Tinasha (Dev)" : "Tinasha",
  description: "",
  slug: "tinasha",
  owner: "haashemi",
  privacy: "public",
  version: "1.0.0",
  platforms: ["android"],
  githubUrl: "https://github.com/haashemi/Tinasha",
  orientation: "portrait",
  userInterfaceStyle: "automatic",
  backgroundColor: "#0f172a",
  icon: "./assets/images/icon.png",
  developmentClient: { silentLaunch: true },
  scheme: "tinasha",
  plugins: ["expo-router", "expo-secure-store"],
  splash: {
    image: "./assets/images/splash.png",
    backgroundColor: "#0f172a",
  },
  android: {
    package: IS_DEV ? "com.haashemi.tinasha.dev" : "com.haashemi.tinasha",
    versionCode: 1,
    adaptiveIcon: {
      foregroundImage: "./assets/images/adaptive-icon.png",
      backgroundColor: "#0f172a",
    },
    softwareKeyboardLayoutMode: "pan",
  },
  experiments: { tsconfigPaths: true, typedRoutes: true, turboModules: true },
  extra: {
    router: { origin: false },
    eas: { projectId: "20bb87cb-0cc2-4c74-bc1e-55c4c48f8158" },
  },
});
