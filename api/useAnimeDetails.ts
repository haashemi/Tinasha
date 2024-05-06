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
    fields = "id,title,main_picture,alternative_titles,start_date,end_date,synopsis,mean,rank,popularity,num_list_users,num_scoring_users,nsfw,genres,created_at,updated_at,media_type,status,my_list_status,num_episodes,start_season,broadcast,source,average_episode_duration,rating,studios,pictures,background,related_anime,related_manga,recommendations,statistics,opening_themes,ending_themes",
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
