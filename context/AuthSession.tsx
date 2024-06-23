import type { AxiosRequestConfig } from "axios";
import { createContext, useContext, useEffect, useMemo } from "react";

import type { AuthResponse } from "@/api";
import { clientId, refreshToken } from "@/api";
import { client } from "@/api/client";

import { useSecureStorage } from "../hooks";

const EXPIRED_TOKEN_HEADER = `Bearer error="invalid_token",error_description="The access token expired"`;

const Context = createContext<{
  auth: AuthResponse | null | undefined;
  setAuthData: (value: string | null) => void;
  signOut: () => void;
}>({
  setAuthData: () => null,
  signOut: () => null,
  auth: null,
});

export const useAuthSession = () => useContext(Context);

export const AuthSessionProvider = ({ children }: React.PropsWithChildren) => {
  const [authData, setAuthData] = useSecureStorage("auth");

  const auth = useMemo(() => {
    if (authData === undefined) return undefined;
    if (authData === null) return null;
    return JSON.parse(authData) as AuthResponse;
  }, [authData]);

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
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

        if (
          error.response.status === 401 &&
          error.response.headers["WWW-Authenticate"] === EXPIRED_TOKEN_HEADER &&
          error.response.data?.error === "invalid_token" &&
          !originalRequest._retry &&
          auth
        ) {
          originalRequest._retry = true;

          const newToken = await refreshToken(auth.refresh_token);
          setAuthData(JSON.stringify(newToken.data));

          client.defaults.headers.common.Authorization = `Bearer ${newToken.data.access_token}`;

          return client(originalRequest);
        }

        // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
        return Promise.reject(error);
      },
    );
  }, [auth, setAuthData]);

  const values = useMemo(() => ({ auth, setAuthData, signOut: () => setAuthData(null) }), [auth, setAuthData]);

  return <Context.Provider value={values}>{children}</Context.Provider>;
};
