export interface AnimeListStatus {
  status: "completed" | "dropped" | "on_hold" | "plan_to_watch" | "watching" | null;
  /** 0-10 */
  score: number;
  /** 0 or the number of watched episodes. */
  num_episodes_watched: number;
  /** If authorized user watches an anime again after completion, this field value is true.
   * In this case, MyAnimeList treats the anime as 'watching' in the user's anime list.*/
  is_rewatching: boolean;
  start_date: Date | null;
  finish_date: Date | null;
  priority: number;
  num_times_rewatched: number;
  rewatch_value: number;
  tags: string[];
  /** You cannot contain this field in a list. */
  comments: string;
  updated_at: Date;
}
