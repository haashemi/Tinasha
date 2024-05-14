import type { MainPicture } from "./MainPicture";

export interface RelatedAnimeEdge {
  node: {
    id: number;
    title: string;
    main_picture: MainPicture;
  };
  /** The type of the relationship between this work and related work. */
  relation_type:
    | "alternative_setting"
    | "alternative_version"
    | "full_story"
    | "parent_story"
    | "prequel"
    | "sequel"
    | "side_story"
    | "summary";
  /** The format of relation_type for human like "Alternative version". */
  relation_type_formatted: string;
}
