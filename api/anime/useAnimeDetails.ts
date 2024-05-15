import { useQuery } from "@tanstack/react-query";

import { client } from "../client";
import type {
  AnimeNode,
  AnimeRecommendationAggregationEdgeBase,
  Picture,
  RelatedAnimeEdge,
  RelatedMangaEdge,
} from "../models";

interface Request {
  animeId?: string;
  fields?: string;
}

interface Response extends AnimeNode {
  pictures: Picture[];
  /** The API strips BBCode tags from the result. */
  background: string | null;
  related_anime: RelatedAnimeEdge[];
  related_manga: RelatedMangaEdge[];
  /** Summary of recommended anime for those who like this anime. */
  recommendations: AnimeRecommendationAggregationEdgeBase[];
  statistics: {
    num_list_users: number;
    status: {
      watching: number;
      completed: number;
      on_hold: number;
      dropped: number;
      plan_to_watch: number;
    };
  };
}

export type { Response as AnimeDetails };

export const useAnimeDetails = (opts: Request) => {
  const {
    animeId,
    fields = "id,title,main_picture,alternative_titles,mean,popularity,genres,media_type,status,my_list_status,num_episodes,start_season,source,average_episode_duration,studios,pictures,related_anime,statistics",
  } = opts;

  return useQuery({
    queryKey: ["anime-details", animeId, fields],
    queryFn: async () => {
      if (!animeId) return undefined;

      const resp = await client.get(`/anime/${animeId}`, { params: { fields } });
      return resp.data as Response;
    },
  });
};
