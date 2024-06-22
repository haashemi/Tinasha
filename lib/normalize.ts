import { Season } from "@/api";

export const getMediaType = (mediaType: string | null | undefined) =>
  mediaType ? (mediaType.includes("special") ? "SPECIAL" : mediaType.toUpperCase().replaceAll("_", " ")) : "Unknown";

export const getAiringStatus = (status?: string) =>
  status === "finished_airing"
    ? "Finished"
    : status === "currently_airing"
      ? "Airing"
      : status === "not_yet_aired"
        ? "Not Aired"
        : "Unknown";

export const getNormalizedSeason = (season?: Season) => {
  switch (season) {
    case Season.Winter:
      return "Winter";
    case Season.Spring:
      return "Spring";
    case Season.Summer:
      return "Summer";
    case Season.Fall:
      return "Fall";
    default:
      return "Unknown";
  }
};

const sourceNameTable: Record<string, string> = {
  other: "Other",
  original: "Original",
  manga: "Manga",
  "4_koma_manga": "4Koma Manga",
  web_manga: "Web Manga",
  digital_manga: "Digital Manga",
  novel: "Novel",
  light_novel: "Light Novel",
  visual_novel: "Visual Novel",
  game: "Game",
  card_game: "Card Game",
  book: "Book",
  picture_book: "PictureBook",
  radio: "Radio",
  music: "Music",
};

export const getSource = (source: string) => {
  return sourceNameTable[source] ?? "Unknown";
};
