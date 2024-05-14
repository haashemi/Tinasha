export interface RelatedMangaEdge {
  node: any; // TODO: fuck around and find out
  relation_type:
    | "alternative_setting"
    | "alternative_version"
    | "full_story"
    | "parent_story"
    | "prequel"
    | "sequel"
    | "side_story"
    | "summary"; // The type of the relationship between this work and related work.
  relation_type_formatted: string; // The format of relation_type for human like "Alternative version".
}
