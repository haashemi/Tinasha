import axios from "axios";
import { makeRedirectUri } from "expo-auth-session";

export interface AuthResponse {
  token_type: string;
  expires_in: number;
  access_token: string;
  refresh_token: string;
}

export const clientId = process.env.EXPO_PUBLIC_MAL_CLIENT_ID ?? "";
export const redirectUri = makeRedirectUri({ scheme: "tinasha", path: "sign-in" });

const tokenEndpoint = "https://myanimelist.net/v1/oauth2/token";

export const makeKeyCode = (length: number) => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
  const charactersLength = characters.length;

  return new Array(length)
    .fill("")
    .reduce((prev) => prev + characters.charAt(Math.floor(Math.random() * charactersLength)));
};

export const getAuthUrl = (state: string, codeChallenge: string) => {
  const params = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    state,
    redirect_uri: redirectUri,
    code_challenge: codeChallenge,
    code_challenge_method: "plain",
  });

  return `https://myanimelist.net/v1/oauth2/authorize?${params.toString()}`;
};

export const exchangeCode = async ({ code, codeChallenge }: { code: string; codeChallenge: string }) => {
  return axios.post<AuthResponse>(
    tokenEndpoint,
    {
      client_id: clientId,
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
      code_verifier: codeChallenge,
    },
    {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    },
  );
};

export const refreshToken = async (token: string) => {
  return axios.post<AuthResponse>(
    tokenEndpoint,
    {
      grant_type: "refresh_token",
      refresh_token: token,
    },
    {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    },
  );
};
