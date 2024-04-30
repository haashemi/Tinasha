import { useQuery } from "@tanstack/react-query";

import { AnimeNode, Field, Season } from "./models";

import { useAuthSession } from "@/components";

interface SeasonalAnimeOptions {
  year: number;
  season: Season;
  sort?: "anime_score" | "anime_num_list_users";
  fields?: Field[];
}

export const getSeason = (month: number): Season =>
  month >= 0 && month <= 2
    ? Season.Winter
    : month >= 3 && month <= 5
      ? Season.Spring
      : month >= 6 && month <= 8
        ? Season.Summer
        : Season.Fall;

export const useSeasonalAnime = ({
  year,
  season,
  sort = "anime_num_list_users",
  fields = ["start_season", "mean", "my_list_status"],
}: SeasonalAnimeOptions) => {
  const { client } = useAuthSession();

  return useQuery({
    queryKey: ["Seasonal-anime", year, season, sort, fields],
    queryFn: async () => {
      const resp = await client.get(`/anime/season/${year}/${season}`, {
        params: { limit: 500, sort, fields: fields.join(",") },
      });
      return resp.data as { data: { node: AnimeNode }[] };
    },
  });
};
