import { useInfiniteQuery } from "@tanstack/react-query";

import { client } from "../client";
import type { Paging, UserAnimeListEdge, WatchingStatus } from "../models";

interface Request {
  /** User name or \@me. */
  username?: string;
  /** Filters returned anime list by these statuses.
   *
   * To return all anime, don't specify this field.
   */
  status?: WatchingStatus;
  sort?: UserAnimeListSort;
  /** Default: 100. The maximum value is 1000. */
  limit?: number;
  /** Default: 0 */
  offset?: number;
  fields?: string;
}

interface Response {
  data: UserAnimeListEdge[];
  paging: Paging;
}

export type UserAnimeListSort = "anime_id" | "anime_start_date" | "anime_title" | "list_score" | "list_updated_at";

export const useUserAnimeList = (opts: Request) => {
  const {
    username = "@me",
    status,
    sort = "anime_title",
    limit = 24,
    offset = 0,
    fields = "alternative_titles,num_episodes,mean,my_list_status",
  } = opts;

  return useInfiniteQuery({
    queryKey: ["user-anime-list", username, status, sort, limit],
    queryFn: async ({ pageParam }) => {
      const resp = await client.get(`/users/${username}/animelist`, {
        params: { status, sort, limit, offset: offset + pageParam * limit, fields, nsfw: 1 },
      });

      return resp.data as Response;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages, lastPageParam, allPageParams) =>
      lastPage.paging.next ? lastPageParam + 1 : undefined,
  });
};
