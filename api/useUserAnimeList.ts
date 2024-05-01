import { useQuery } from "@tanstack/react-query";

import { AnimeNode, Field, Status } from "./models";

import { useAuthSession } from "@/components";

interface UserAnimeListOptions {
  status?: Status;
  sort: "list_score" | "list_updated_at" | "anime_title" | "anime_start_date" | "anime_id";
  limit?: number;
  offset?: number;
  fields: Field[];
}

interface AnimeListStatus {
  status?: "watching" | "completed" | "on_hold" | "dropped" | "plan_to_watch" | null;
  score: number;
  num_episodes_watched: number;
  is_rewatching: boolean;
  start_date: string | null; // date
  finish_date: string | null; // date
  priority: number;
  num_times_rewatched: number;
  rewatch_value: number;
  tags: string[];
  comments: string;
  updated_at: string; // date-time
}

interface UserAnimeListEdge {
  node: AnimeNode;
  list_status: AnimeListStatus;
}

interface Response {
  data: UserAnimeListEdge[];
  paging: { next: string };
}

export const useUserAnimeList = (user_name: string, { status, sort, limit, offset, fields }: UserAnimeListOptions) => {
  const { client } = useAuthSession();

  return useQuery({
    queryKey: ["anime-list", user_name, status, sort, limit, offset, fields],
    queryFn: async () => {
      if (user_name === "") return {} as Response;

      const resp = await client.get(`/users/${user_name}/animelist`, {
        params: { status, sort, limit, offset, fields: fields.join(",") },
      });

      return resp.data as Response;
    },
  });
};
