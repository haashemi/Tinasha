import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "../client";
import type { WatchingStatus } from "../models";

interface Request {
  status?: WatchingStatus;
  is_rewatching?: boolean;
  start_date?: string;
  finish_date?: string;
  /** 0-10 */
  score?: number;
  num_watched_episodes?: number;
  priority?: number;
  num_times_rewatched?: number;
  rewatch_value?: number;
  tags?: string;
  comments?: string;
}

interface Response {
  status: WatchingStatus | null;
  /** 0-10 */
  score: number;
  num_episodes_watched: number;
  /** If authorized user watches an anime again after completion, this field value is true.
   *
   * In this case, MyAnimeList treats the anime as 'watching' in the user's anime list.
   */
  is_rewatching: boolean;
  start_date?: string;
  finish_date?: string;
  priority: number;
  num_times_rewatched: number;
  rewatch_value: number;
  tags: string[];
  comments: string;
  updated_at: Date;
}

export type { Request as UpdateAnimeListStatusBody };

export const useUpdateMyAnimeListStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["update-my-anime-list-status"],
    mutationFn: async ({ animeId, body }: { animeId: number; body: Request }) => {
      try {
        const resp = await client.patch(`/anime/${animeId}/my_list_status`, body, {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        });
        console.log(resp);
        return resp.data as Response;
      } catch (error) {
        console.log(error);
        return null;
      }
    },
    onSuccess: (_, { animeId }) => {
      void queryClient.refetchQueries({ queryKey: ["user-anime-list", "@me"] });
      void queryClient.refetchQueries({ queryKey: ["anime-details", animeId] });
    },
  });
};
