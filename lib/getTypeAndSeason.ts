import type { StartSeason } from "@/api/models/StartSeason";

import { getMediaType, getNormalizedSeason } from "./normalize";

export const getTypeAndSeason = (mediaType: string, startSeason: StartSeason | null) => {
  const season = startSeason ? `${getNormalizedSeason(startSeason.season)} ${startSeason.year}` : "";
  return `${getMediaType(mediaType)}${season ? ", " : ""}${season}`;
};
