import { useQuery } from "@tanstack/react-query";

import { HOST, client } from "./client";

type SessionalAnimeOptions = {
  year: number;
  season: Season;
  sort?: "anime_score" | "anime_num_list_users";
};

export enum Season {
  Winter = "winter",
  Spring = "spring",
  Summer = "summer",
  Fall = "fall",
}

export const getSeason = (month: number): Season =>
  month >= 0 && month <= 2
    ? Season.Winter
    : month >= 3 && month <= 5
      ? Season.Spring
      : month >= 6 && month <= 8
        ? Season.Summer
        : Season.Fall;

export const useSessionalAnime = ({ year, season, sort = "anime_num_list_users" }: SessionalAnimeOptions) =>
  useQuery({
    queryKey: ["sessional-anime"],
    queryFn: async () => {
      const resp = await client.get(`${HOST}/anime/season/${year}/${season}`, { params: { limit: 500, sort } });
      return resp.data;
    },
  });
