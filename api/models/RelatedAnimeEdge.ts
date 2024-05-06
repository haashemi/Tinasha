import { MainPicture } from "./MainPicture";

export interface RelatedAnimeEdge {
  node: {
    id: number;
    title: string;
    main_picture: MainPicture;
  };
  /**The type of the relationship between this work and related work. */
  relation_type:
    | "sequel"
    | "prequel"
    | "alternative_setting"
    | "alternative_version"
    | "side_story"
    | "parent_story"
    | "summary"
    | "full_story";
  /**The format of relation_type for human like "Alternative version". */
  relation_type_formatted: string;
}
