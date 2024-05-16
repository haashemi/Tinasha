import type { AlternativeTitles } from "./AlternativeTitles";
import type { AnimeStudio } from "./AnimeStudio";
import type { Broadcast } from "./Broadcast";
import type { Genre } from "./Genre";
import type { MyListStatus } from "./MyListStatus";
import type { Picture } from "./Picture";
import type { Rating } from "./Rating";
import type { StartSeason } from "./StartSeason";

export interface AnimeNode {
  id: number;
  title: string;
  main_picture: Picture;
  /** "synonyms" or ISO 639-1 */
  alternative_titles: AlternativeTitles;
  start_date: string | null;
  end_date: string | null;
  /** Synopsis. The API strips BBCode tags from the result. */
  synopsis: string | null;
  /** Mean score.
   *
   * When the mean can not be calculated, such as when the number of user scores is
   * small, the result does not include this field.
   */
  mean: number | null;
  /** When the rank can not be calculated, such as when the number of user scores is small, the result does not include this field. */
  rank: number | null;
  popularity: number;
  /** Number of users who have this work in their list. */
  num_list_users: number;
  num_scoring_users: number;
  nsfw: "black" | "gray" | "white" | null;
  genres: Genre[];
  created_at: Date | null;
  updated_at: Date | null;
  media_type: "movie" | "music" | "ona" | "ova" | "special" | "tv" | "unknown";
  /** Airing status. */
  status: "currently_airing" | "finished_airing" | "not_yet_aired";
  /** Status of user's anime list. If there is no access token, the API excludes this field. */
  my_list_status: MyListStatus | null;
  /** The total number of episodes of this series. If unknown, it is 0. */
  num_episodes: number;
  start_season: StartSeason | null;
  /** Broadcast date. */
  broadcast: Broadcast | null;
  /** Original work. */
  source: string | null; // TODO:
  /** Average length of episode in seconds. */
  average_episode_duration: number | null;
  rating: Rating | null;
  studios: AnimeStudio[];
}
