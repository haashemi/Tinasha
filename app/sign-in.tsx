import axios from "axios";
import { router, useLocalSearchParams } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useCallback, useEffect, useState } from "react";
import { Alert, View } from "react-native";
import { Button, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

import { exchangeCode, getAuthUrl, makeKeyCode, redirectUri } from "@/api/auth";
import { TinashaLogo, useAuthSession } from "@/components";

export default function SignIn() {
  const [codeState] = useState(makeKeyCode(24));
  const [codeChallenge] = useState(makeKeyCode(128));
  const [loading, setLoading] = useState(false);

  const { auth, setAuthData } = useAuthSession();

  const { code, state } = useLocalSearchParams<{ code?: string; state?: string }>();

  const login = async () => {
    setAuthData(null);
    await WebBrowser.openAuthSessionAsync(getAuthUrl(codeState, codeChallenge), redirectUri);
  };

  const authorize = useCallback(async () => {
    if (!code || !state || auth) return;

    if (state !== codeState) {
      Alert.alert("Unmatched state!", "Authorization failed because oAuth state codes are not matched.");
      return;
    }

    try {
      const resp = await exchangeCode({ code, codeChallenge });
      setAuthData(JSON.stringify(resp.data));
      router.replace("/");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        Alert.alert("Failed to exchange-code!", error.message);
      } else {
        Alert.alert("Authorization failed!", "Something unexpected went wrong, please report it to us.");
      }
    }
  }, [auth, code, codeChallenge, codeState, setAuthData, state]);

  useEffect(() => {
    setLoading(true);
    authorize().then(() => setLoading(false));
  }, [authorize]);

  return (
    <SafeAreaView style={{ flex: 1, alignItems: "center", paddingHorizontal: 24 }}>
      <TinashaLogo width="60%" height={400} fill="white" />

      <View style={{ width: "75%", gap: 10, alignItems: "center" }}>
        <Text variant="headlineSmall">Welcome to Tinasha!</Text>
        <Text variant="bodyLarge">Please sign in with your MyAnimeList account.</Text>
      </View>

      <View style={{ flex: 1, justifyContent: "center" }}>
        <Button loading={loading} onPress={() => login()} icon="login" buttonColor="#1d4ed8" textColor="white">
          Sign in with MyAnimeList
        </Button>
      </View>
    </SafeAreaView>
  );
}
