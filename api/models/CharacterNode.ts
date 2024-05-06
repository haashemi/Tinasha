import { MainPicture } from "./MainPicture";

export interface CharacterNode {
  id: number;
  first_name: string;
  last_name: string;
  alternative_name: string;
  main_picture: MainPicture;
  biography: string;
  num_favorites: number;
}
