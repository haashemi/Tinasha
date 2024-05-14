import type { AnimeListStatus } from "./AnimeListStatus";
import type { AnimeNode } from "./AnimeNode";

export interface UserAnimeListEdge {
  node: AnimeNode;
  list_status: AnimeListStatus;
}
