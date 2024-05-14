import { createContext, useContext, useEffect, useMemo } from "react";

import type { AuthResponse } from "@/api";
import { clientId, refreshToken } from "@/api";
import { client } from "@/api/client";

import { useSecureStorage } from "../hooks";

const EXPIRED_TOKEN_HEADER = `Bearer error="invalid_token",error_description="The access token expired"`;

interface ContextValues {
  auth: AuthResponse | null | undefined;
  setAuthData: (value: string | null) => void;
  signOut: () => void;
}

const Context = createContext<ContextValues>({ setAuthData: () => null, signOut: () => null, auth: null });

export const useAuthSession = () => useContext(Context);

export const AuthSessionProvider = ({ children }: React.PropsWithChildren) => {
  const [authData, setAuthData] = useSecureStorage("auth");

  const auth = useMemo(() => (authData ? (JSON.parse(authData) as AuthResponse) : undefined), [authData]);

  useEffect(() => {
    client.interceptors.request.clear();
    client.interceptors.request.use((req) => {
      if (auth) {
        req.headers.setAuthorization(`Bearer ${auth.access_token}`);
      } else {
        req.headers.set("X-MAL-CLIENT-ID", clientId);
      }

      return req;
    });

    client.interceptors.response.clear();
    client.interceptors.response.use(
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

          const newToken = await refreshToken(auth?.refresh_token);
          setAuthData(JSON.stringify(newToken.data));

          client.defaults.headers.common.Authorization = `Bearer ${newToken.data.access_token}`;

          return client(originalRequest);
        }

        return Promise.reject(error);
      },
    );
  }, [auth, setAuthData]);

  const values = useMemo(() => ({ auth, setAuthData, signOut: () => setAuthData(null) }), [auth, setAuthData]);

  return <Context.Provider value={values}>{children}</Context.Provider>;
};
