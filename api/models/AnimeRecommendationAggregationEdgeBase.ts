import type { Picture } from "./Picture";

export interface AnimeRecommendationAggregationEdgeBase {
  node: {
    id: number;
    title: string;
    main_picture: Picture;
  };
  num_recommendations: number;
}
