import { useCallback } from "react";

import useAsyncStorage from "./useAsyncStorage";

type ListTypes = "anime-list" | "seasonal-anime" | "user-anime-list";

export const useNsfw = (listType: ListTypes, defaultValue: "disabled" | "enabled") => {
  const [value, setValue] = useAsyncStorage(`nsfw-${listType}`, defaultValue);

  const toggle = useCallback(() => setValue(value === "enabled" ? "disabled" : "enabled"), [setValue, value]);

  return [value === "enabled", toggle] as const;
};

export const useAnimeListNsfw = () => useNsfw("anime-list", "enabled");

export const useSeasonalAnimeNsfw = () => useNsfw("seasonal-anime", "disabled");

export const useUserAnimeListNsfw = () => useNsfw("user-anime-list", "enabled");
