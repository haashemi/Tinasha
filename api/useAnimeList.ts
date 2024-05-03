import { useQuery } from "@tanstack/react-query";

import { DefaultAnimeListFields } from "./fields";
import { AnimeNode } from "./models";

import { useAuthSession } from "@/components";

interface AnimeListOptions {
  query: string;
}

interface Response {
  data: { node: AnimeNode }[];
  paging: { next: string };
}

export const useAnimeList = ({ query }: AnimeListOptions) => {
  const { client } = useAuthSession();

  return useQuery({
    queryKey: ["anime-list", query],
    queryFn: async () => {
      if (query === "") return {} as Response;

      const resp = await client.get("/anime", {
        params: { q: query, limit: 50, offset: 0, fields: DefaultAnimeListFields },
      });

      return resp.data as Response;
    },
  });
};
