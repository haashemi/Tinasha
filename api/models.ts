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
  source?:
    | "other"
    | "original"
    | "manga"
    | "4_koma_manga"
    | "web_manga"
    | "digital_manga"
    | "novel"
    | "light_novel"
    | "visual_novel"
    | "game"
    | "card_game"
    | "book"
    | "picture_book"
    | "radio"
    | "music";
  average_episode_duration?: number;
  rating?: string;
  studios?: Studio[];
  end_date?: string;
  my_list_status?: MyListStatus;
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

export type Status = "watching" | "completed" | "on_hold" | "dropped" | "plan_to_watch";

interface MyListStatus {
  status: Status | null;
  score: number;
  num_episodes_watched: number;
  is_rewatching: boolean;
  updated_at: string;
  start_date?: string;
}
