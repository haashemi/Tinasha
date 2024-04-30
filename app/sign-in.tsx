import { Redirect, useLocalSearchParams } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useEffect, useState } from "react";
import { Button } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

import { exchangeCode, getAuthUrl, makeKeyCode } from "@/api/auth";
import { useAuthSession } from "@/components";

export default function Settings() {
  // TODO: use the state param
  const { code } = useLocalSearchParams<{ code?: string; state?: string }>();
  const [state] = useState(makeKeyCode(24));
  const [codeChallenge] = useState(makeKeyCode(128));
  const session = useAuthSession();

  const onLogin = async () => {
    await WebBrowser.openAuthSessionAsync(getAuthUrl(state, codeChallenge));
  };

  // TODO: handle the errors.
  useEffect(() => {
    if (!code || session.auth) return;

    exchangeCode({ code, codeChallenge }).then((resp) => session.setAuthData(JSON.stringify(resp.data)));
  }, [code, codeChallenge, session]);

  if (session.auth) {
    return <Redirect href="/(app)/(tabs)/" />;
  }

  // TODO: show a proper Ui and Loading state
  return (
    <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Button mode="contained" onPress={() => onLogin()}>
        Login
      </Button>
    </SafeAreaView>
  );
}
