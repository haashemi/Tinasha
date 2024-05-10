import { useInfiniteQuery } from "@tanstack/react-query";

import { client } from "../client";
import { AnimeNode, Paging } from "../models";

interface Request {
  /**Search. */
  q: string;
  /**Default: 100. The maximum value is 100. */
  limit?: number;
  /**Default: 0 */
  offset?: number;
  fields?: string;
}

interface Response {
  data: { node: AnimeNode }[];
  paging: Paging;
}

export const useAnimeList = (opts: Request) => {
  const { q, limit = 24, offset = 0, fields = "alternative_titles,num_episodes,mean,my_list_status" } = opts;

  return useInfiniteQuery({
    queryKey: ["anime-list", q],
    queryFn: async ({ pageParam }) => {
      if (q === "") return {} as Response;

      const resp = await client.get("/anime", {
        params: { q, limit, offset: offset + pageParam * limit, fields, nsfw: 1 },
      });

      return resp.data as Response;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages, lastPageParam, allPageParams) =>
      lastPage.paging?.next ? lastPageParam + 1 : undefined,
  });
};