import axios, { AxiosInstance } from "axios";
import { createContext, useContext, useMemo } from "react";

import { useStorageState } from "./useStorageState";

import { refreshToken } from "@/api";

const EXPIRED_TOKEN_HEADER = `Bearer error="invalid_token",error_description="The access token expired"`;

const AuthSessionContext = createContext<{
  setAuthData: (value: string | null) => void;
  signOut: () => void;
  auth?: string | null;
  client: AxiosInstance;
}>({
  setAuthData: () => null,
  signOut: () => null,
  auth: null,
  client: axios.create({ baseURL: "https://api.myanimelist.net/v2" }),
});

export function useAuthSession() {
  const value = useContext(AuthSessionContext);
  if (process.env.NODE_ENV !== "production") {
    if (!value) {
      throw new Error("useAuthSession must be wrapped in a <AuthSessionProvider />");
    }
  }

  return value;
}

export const AuthSessionProvider = ({ children }: React.PropsWithChildren) => {
  const [authData, setAuthData] = useStorageState("auth");

  const auth = useMemo(() => (authData ? JSON.parse(authData) : null), [authData]);

  const client = useMemo(() => {
    const axiosClient = axios.create({
      baseURL: "https://api.myanimelist.net/v2",
      headers: { Authorization: `Bearer ${auth?.access_token}` },
    });

    axiosClient.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (
          error.response.status === 401 &&
          error.response.headers["WWW-Authenticate"] === EXPIRED_TOKEN_HEADER &&
          error.response.data?.error === "invalid_token" &&
          !originalRequest._retry
        ) {
          originalRequest._retry = true;

          const newToken = await refreshToken(auth.refresh_token);
          setAuthData(JSON.stringify(newToken.data));

          axiosClient.defaults.headers.common["Authorization"] = `Bearer ${newToken.data.access_token}`;

          return axiosClient(originalRequest);
        }

        return Promise.reject(error);
      },
    );

    return axiosClient;
  }, [auth, setAuthData]);

  return (
    <AuthSessionContext.Provider
      value={{
        setAuthData,
        signOut: () => setAuthData(null),
        auth,
        client,
      }}
    >
      {children}
    </AuthSessionContext.Provider>
  );
};
