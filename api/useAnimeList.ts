import { useInfiniteQuery } from "@tanstack/react-query";

import { DefaultAnimeListFields } from "./fields";
import { AnimeNode } from "./models";

import { useAuthSession } from "@/components";

interface AnimeListOptions {
  query: string;
  limit?: number;
}

interface Response {
  data: { node: AnimeNode }[];
  paging: { next: string };
}

export const useAnimeList = (opts: AnimeListOptions) => {
  const { query, limit = 24 } = opts;
  const { client } = useAuthSession();

  return useInfiniteQuery({
    queryKey: ["anime-list", query],
    queryFn: async ({ pageParam }) => {
      if (query === "") return {} as Response;

      const resp = await client.get("/anime", {
        params: { q: query, limit, offset: pageParam * limit, fields: DefaultAnimeListFields },
      });

      return resp.data as Response;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages, lastPageParam, allPageParams) =>
      lastPage.paging?.next ? lastPageParam + 1 : undefined,
  });
};
