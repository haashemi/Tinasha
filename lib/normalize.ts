import { Season } from "@/api/models/Season";

export const getMediaType = (mediaType: string) =>
  mediaType.includes("special") ? "SPECIAL" : mediaType.toUpperCase().replaceAll("_", " ");

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

export const getSource = (source?: string | null) => {
  switch (source) {
    case "other":
      return "Other";
    case "original":
      return "Original";
    case "manga":
      return "Manga";
    case "4_koma_manga":
      return "4Koma Manga";
    case "web_manga":
      return "Web Manga";
    case "digital_manga":
      return "Digital Manga";
    case "novel":
      return "Novel";
    case "light_novel":
      return "Light Novel";
    case "visual_novel":
      return "Visual Novel";
    case "game":
      return "Game";
    case "card_game":
      return "Card Game";
    case "book":
      return "Book";
    case "picture_book":
      return "PictureBook";
    case "radio":
      return "Radio";
    case "music":
      return "Music";
    default:
      return "Unknown";
  }
};
