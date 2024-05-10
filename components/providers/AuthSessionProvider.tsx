import { createContext, useContext, useEffect, useMemo } from "react";

import { useSecureStorage } from "../hooks";

import { refreshToken } from "@/api";
import { client } from "@/api/client";

const EXPIRED_TOKEN_HEADER = `Bearer error="invalid_token",error_description="The access token expired"`;

interface AuthSessionContextValues {
  setAuthData: (value: string | null) => void;
  signOut: () => void;
  auth?: string | null;
}

const AuthSessionContext = createContext<AuthSessionContextValues>({
  setAuthData: () => null,
  signOut: () => null,
  auth: null,
});

export const useAuthSession = () => useContext(AuthSessionContext);

export const AuthSessionProvider = ({ children }: React.PropsWithChildren) => {
  const [authData, setAuthData] = useSecureStorage("auth");

  const auth = useMemo(() => (authData ? JSON.parse(authData) : authData), [authData]);

  useEffect(() => {
    client.interceptors.request.clear();
    client.interceptors.request.use((req) => {
      req.headers.setAuthorization(`Bearer ${auth?.access_token}`);
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

          client.defaults.headers.common["Authorization"] = `Bearer ${newToken.data.access_token}`;

          return client(originalRequest);
        }

        return Promise.reject(error);
      },
    );
  }, [auth?.access_token, auth?.refresh_token, setAuthData]);

  return (
    <AuthSessionContext.Provider value={{ setAuthData, signOut: () => setAuthData(null), auth }}>
      {children}
    </AuthSessionContext.Provider>
  );
};
