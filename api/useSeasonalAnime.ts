import { useQuery } from "@tanstack/react-query";

import { HOST, client } from "./client";

type SessionalAnimeOptions = {
  year: number;
  season: Season;
  sort?: "anime_score" | "anime_num_list_users";
  fields?: string[];
};

interface SessionalAnimeResponse {
  node: {
    id: number;
    title: string;
    main_picture: {
      medium: string;
      large: string;
    };
    alternative_titles?: { synonyms: string[]; en: string; ja: string };
    start_date?: string;
    synopsis?: string;
    mean?: number;
    rank?: number;
    popularity?: number;
    num_list_users?: number;
    num_scoring_users?: number;
    nsfw?: string;
    created_at?: string;
    updated_at?: string;
    media_type?: string;
    status?: string;
    genres?: { id: number; name: string }[];
    num_episodes?: number;
    start_season?: { year: number; season: string };
    broadcast?: { day_of_the_week: string; start_time: string };
    source?: string;
    average_episode_duration?: number;
    rating?: string;
    studios?: { id: number; name: string }[];
  };
}

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

export const useSessionalAnime = ({
  year,
  season,
  sort = "anime_num_list_users",
  fields = ["start_season", "mean", "media_type"],
}: SessionalAnimeOptions) =>
  useQuery({
    queryKey: ["sessional-anime", year, season],
    queryFn: async () => {
      const resp = await client.get(`${HOST}/anime/season/${year}/${season}`, {
        params: { limit: 500, sort, fields: fields.join(",") },
      });
      return resp.data as { data: SessionalAnimeResponse[] };
    },
  });
