import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "../client";
import { WatchingStatus } from "../models";

interface Request {
  status?: WatchingStatus;
  is_rewatching?: boolean;
  /**0-10 */
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
  /**0-10 */
  score: number;
  num_episodes_watched: number;
  /**If authorized user watches an anime again after completion, this field value is true.
   *
   * In this case, MyAnimeList treats the anime as 'watching' in the user's anime list.
   */
  is_rewatching: boolean;
  start_date: Date | null;
  finish_date: Date | null;
  priority: number;
  num_times_rewatched: number;
  rewatch_value: number;
  tags: string[];
  comments: string;
  updated_at: Date;
}

export { Request as UpdateAnimeListStatusBody };

export const useUpdateMyAnimeListStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["update-my-anime-list-status"],
    mutationFn: async ({ animeId, body }: { animeId: number; body: Request }) => {
      const resp = await client.patch(`/anime/${animeId}/my_list_status`, body, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });
      return resp.data as Response;
    },
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["user-anime-list", "@me"] });
    },
  });
};
