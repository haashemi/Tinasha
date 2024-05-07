import { useQuery } from "@tanstack/react-query";

import {
  AnimeNode,
  AnimeRecommendationAggregationEdgeBase,
  Picture,
  RelatedAnimeEdge,
  RelatedMangaEdge,
} from "./models";

import { useAuthSession } from "@/components";

interface Request {
  animeId: string;
  fields?: string;
}

interface Response extends AnimeNode {
  pictures: Picture[];
  /**The API strips BBCode tags from the result. */
  background: string | null;
  related_anime: RelatedAnimeEdge[];
  related_manga: RelatedMangaEdge[];
  /**Summary of recommended anime for those who like this anime. */
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

export const useAnimeDetails = (opts: Request) => {
  const {
    animeId,
    fields = "id,title,main_picture,alternative_titles,mean,popularity,genres,media_type,status,num_episodes,start_season,source,average_episode_duration,studios,statistics",
  } = opts;
  const { client } = useAuthSession();

  return useQuery({
    queryKey: ["anime-details", animeId, fields],
    queryFn: async () => {
      const resp = await client.get(`/anime/${animeId}`, { params: { fields } });
      return resp.data as Response;
    },
  });
};
