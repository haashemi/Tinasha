import { AlternativeTitles } from "./AlternativeTitles";
import { AnimeStudio } from "./AnimeStudio";
import { Broadcast } from "./Broadcast";
import { Genre } from "./Genre";
import { MainPicture } from "./MainPicture";
import { MyListStatus } from "./MyListStatus";
import { Rating } from "./Rating";
import { StartSeason } from "./StartSeason";

export interface AnimeNode {
  id: number;
  title: string;
  main_picture: MainPicture;
  /**"synonyms" or ISO 639-1 */
  alternative_titles: AlternativeTitles;
  start_date: string | null;
  end_date: string | null;
  /**Synopsis. The API strips BBCode tags from the result. */
  synopsis: string | null;
  /**Mean score.
   *
   * When the mean can not be calculated, such as when the number of user scores is
   * small, the result does not include this field.
   */
  mean: number | null;
  /**When the rank can not be calculated, such as when the number of user scores is small, the result does not include this field. */
  rank: number | null;
  popularity: number;
  /**Number of users who have this work in their list. */
  num_list_users: number;
  num_scoring_users: number;
  nsfw: "white" | "gray" | "black" | null;
  genres: Genre[];
  created_at: Date | null;
  updated_at: Date | null;
  media_type: "unknown" | "tv" | "ova" | "movie" | "special" | "ona" | "music";
  /**Airing status. */
  status: "finished_airing" | "currently_airing" | "not_yet_aired";
  /**Status of user's anime list. If there is no access token, the API excludes this field. */
  my_list_status: MyListStatus | null;
  /**The total number of episodes of this series. If unknown, it is 0. */
  num_episodes: number;
  start_season: StartSeason | null;
  /**Broadcast date. */
  broadcast: Broadcast | null;
  /**Original work. */
  source: string | null; // TODO:
  /**Average length of episode in seconds. */
  average_episode_duration: number | null;
  rating: Rating | null;
  studios: AnimeStudio[];
}
