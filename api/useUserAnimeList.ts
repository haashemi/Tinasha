import { useInfiniteQuery } from "@tanstack/react-query";

import { DefaultUserAnimeListFields } from "./fields";
import { AnimeNode, Status } from "./models";

import { useAuthSession } from "@/components";

interface UserAnimeListOptions {
  status?: Status;
  sort?: "list_score" | "list_updated_at" | "anime_title" | "anime_start_date" | "anime_id";
  limit?: number;
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

export interface UserAnimeListEdge {
  node: AnimeNode;
  list_status: AnimeListStatus;
}

interface Response {
  data: UserAnimeListEdge[];
  paging: { previous: string; next: string };
}

export const useUserAnimeList = (user_name: string, opts: UserAnimeListOptions) => {
  const { status, sort = "anime_title", limit = 24 } = opts;

  const { client } = useAuthSession();

  return useInfiniteQuery({
    queryKey: ["anime-list", user_name, status, sort, limit],
    queryFn: async ({ pageParam }) => {
      if (user_name === "") return {} as Response;

      const resp = await client.get(`/users/${user_name}/animelist`, {
        params: { status, sort, limit, offset: pageParam * limit, fields: DefaultUserAnimeListFields },
      });

      return resp.data as Response;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages, lastPageParam, allPageParams) =>
      lastPage.paging.next ? lastPageParam + 1 : undefined,
  });
};
