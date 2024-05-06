import { MainPicture } from "./MainPicture";

export interface AnimeRecommendationAggregationEdgeBase {
  node: {
    id: number;
    title: string;
    main_picture: MainPicture;
  };
  num_recommendations: number;
}
