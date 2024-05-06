export interface RelatedMangaEdge {
  node: any; //TODO: fuck around and find out
  relation_type:
    | "sequel"
    | "prequel"
    | "alternative_setting"
    | "alternative_version"
    | "side_story"
    | "parent_story"
    | "summary"
    | "full_story"; // The type of the relationship between this work and related work.
  relation_type_formatted: string; // The format of relation_type for human like "Alternative version".
}
