export type Field =
  | "id"
  | "title"
  | "main_picture"
  | "alternative_titles"
  | "start_date"
  | "end_date"
  | "synopsis"
  | "mean"
  | "rank"
  | "popularity"
  | "num_list_users"
  | "num_scoring_users"
  | "nsfw"
  | "created_at"
  | "updated_at"
  | "media_type"
  | "status"
  | "genres"
  | "my_list_status"
  | "num_episodes"
  | "start_season"
  | "broadcast"
  | "source"
  | "average_episode_duration"
  | "rating"
  | "pictures"
  | "background"
  | "related_anime"
  | "related_mangarecommendations"
  | "studios"
  | "statistics"
  | "opening_themes"
  | "ending_themes";

export enum Season {
  Winter = "winter",
  Spring = "spring",
  Summer = "summer",
  Fall = "fall",
}

export interface AnimeNode {
  id: number;
  title: string;
  main_picture?: MainPicture;
  alternative_titles?: AlternativeTitles;
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
  genres?: Genre[];
  num_episodes?: number;
  start_season?: SeasonInfo;
  broadcast?: Broadcast;
  source?: string;
  average_episode_duration?: number;
  rating?: string;
  studios?: Studio[];
}

interface MainPicture {
  medium: string;
  large: string;
}

interface AlternativeTitles {
  synonyms: string[];
  en: string;
  ja: string;
}

interface Genre {
  id: number;
  name: string;
}

interface SeasonInfo {
  year: number;
  season: string;
}

interface Broadcast {
  day_of_the_week: string;
  start_time: string;
}

interface Studio {
  id: number;
  name: string;
}
