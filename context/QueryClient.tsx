import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import type { ReactNode } from "react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
      staleTime: 1_800_000, // 30 minutes
    },
  },
});

const asyncStoragePersister = createAsyncStoragePersister({ storage: AsyncStorage });

export const QueryClientProvider = ({ children }: { children: ReactNode }) => (
  <PersistQueryClientProvider client={queryClient} persistOptions={{ persister: asyncStoragePersister }}>
    {children}
  </PersistQueryClientProvider>
);
