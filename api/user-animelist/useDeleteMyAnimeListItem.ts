import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "../client";

export const useDeleteMyAnimeListItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["delete-my-anime-list-item"],
    mutationFn: async ({ animeId }: { animeId: number }) => {
      const resp = await client.delete(`/anime/${animeId}/my_list_status`, {
        validateStatus: (s) => [200, 404].includes(s),
      });

      return resp.status === 200;
    },
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["user-anime-list", "@me"] });
    },
  });
};
