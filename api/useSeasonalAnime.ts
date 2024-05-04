import { useInfiniteQuery } from "@tanstack/react-query";

import { DefaultSeasonalAnimeFields } from "./fields";
import { AnimeNode, Season } from "./models";

import { useAuthSession } from "@/components";

export type SeasonalAnimeSort = "anime_score" | "anime_num_list_users";

interface SeasonalAnimeOptions {
  year: number;
  season: Season;
  sort: SeasonalAnimeSort;
  limit?: number;
}

interface Response {
  data: { node: AnimeNode }[];
  paging: { previous: string; next: string };
}

export const getSeason = (month: number): Season =>
  month >= 0 && month <= 2
    ? Season.Winter
    : month >= 3 && month <= 5
      ? Season.Spring
      : month >= 6 && month <= 8
        ? Season.Summer
        : Season.Fall;

export const useSeasonalAnime = (opts: SeasonalAnimeOptions) => {
  const { year, season, sort, limit = 27 } = opts;

  const { client } = useAuthSession();

  return useInfiniteQuery({
    queryKey: ["seasonal-anime", year, season.toString(), sort],
    queryFn: async ({ pageParam }) => {
      const resp = await client.get(`/anime/season/${year}/${season}`, {
        params: { sort, limit, offset: pageParam * limit, fields: DefaultSeasonalAnimeFields },
      });

      return resp.data as Response;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages, lastPageParam, allPageParams) =>
      lastPage.paging.next ? lastPageParam + 1 : undefined,
  });
};
