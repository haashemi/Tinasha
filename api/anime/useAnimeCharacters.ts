import { useQuery } from "@tanstack/react-query";

import { client } from "../client";
import { CharacterNode, Paging } from "../models";

interface Request {
  animeId: string;
  fields?: string;
}

interface Response {
  data: { node: CharacterNode; role: string }[];
  paging: Paging;
}

export const useAnimeCharacters = (opts: Request) => {
  const { animeId, fields = "id,first_name,last_name,alternative_name,main_picture,role" } = opts;

  return useQuery({
    queryKey: ["anime-characters", animeId, fields],
    queryFn: async () => {
      const resp = await client.get(`/anime/${animeId}/characters`, { params: { fields } });
      return resp.data as Response;
    },
  });
};
