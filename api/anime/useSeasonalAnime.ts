import { useInfiniteQuery } from "@tanstack/react-query";

import { AnimeNode, Paging, Season } from "../models";

import { useAuthSession } from "@/components";

interface Request {
  sort: SeasonalAnimeSort;
  /**Default: 100. The maximum value is 500. */
  limit?: number;
  /**Default: 0 */
  offset?: number;
  fields?: string;
}

interface Response {
  data: { node: AnimeNode }[];
  paging: Paging;
}

export type SeasonalAnimeSort = "anime_score" | "anime_num_list_users";

export const useSeasonalAnime = (year: number, season: Season, opts: Request) => {
  const { sort, limit = 27, offset = 0, fields = "start_season,mean,my_list_status,media_type" } = opts;

  const { client } = useAuthSession();

  return useInfiniteQuery({
    queryKey: ["seasonal-anime", year, season.toString(), sort],
    queryFn: async ({ pageParam }) => {
      const resp = await client.get(`/anime/season/${year}/${season}`, {
        params: { sort, limit, offset: offset + pageParam * limit, fields, nsfw: 1 },
      });

      return resp.data as Response;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages, lastPageParam, allPageParams) =>
      lastPage.paging.next ? lastPageParam + 1 : undefined,
  });
};
