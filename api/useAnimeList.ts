import { useQuery } from "@tanstack/react-query";

import { AnimeNode, Field } from "./models";

import { useAuthSession } from "@/components";

interface AnimeListOptions {
  query: string;
  fields?: Field[];
}

interface Response {
  data: { node: AnimeNode }[];
  paging: { next: string };
}

export const useAnimeList = ({ query, fields = ["start_season", "mean", "media_type"] }: AnimeListOptions) => {
  const { client } = useAuthSession();

  return useQuery({
    queryKey: ["anime-list", query, fields],
    queryFn: async () => {
      if (query === "") return {} as Response;

      const resp = await client.get("/anime", {
        params: { q: query, limit: 50, offset: 0, fields: fields.join(",") },
      });

      return resp.data as Response;
    },
  });
};
