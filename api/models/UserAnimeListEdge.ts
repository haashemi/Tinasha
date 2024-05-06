import { AnimeListStatus } from "./AnimeListStatus";
import { AnimeNode } from "./AnimeNode";

export interface UserAnimeListEdge {
  node: AnimeNode;
  list_status: AnimeListStatus;
}
