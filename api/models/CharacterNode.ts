import type { Picture } from "./Picture";

export interface CharacterNode {
  id: number;
  first_name: string;
  last_name: string;
  alternative_name: string;
  main_picture?: Picture;
  biography: string;
  num_favorites: number;
}
