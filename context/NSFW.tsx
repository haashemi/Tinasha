import { createContext, useCallback, useContext, useMemo } from "react";

import { useAsyncStorage } from "@/hooks";

type ListTypes = "anime-list" | "seasonal-anime" | "user-anime-list";

const Context = createContext<{
  animeListNsfw: boolean;
  toggleAnimeListNsfw: () => void;
  seasonalAnimeNsfw: boolean;
  toggleSeasonalAnimeNsfw: () => void;
  userAnimeListNsfw: boolean;
  toggleUserAnimeListNsfw: () => void;
}>({
  animeListNsfw: false,
  toggleAnimeListNsfw: () => null,
  seasonalAnimeNsfw: false,
  toggleSeasonalAnimeNsfw: () => null,
  userAnimeListNsfw: false,
  toggleUserAnimeListNsfw: () => null,
});

const useNsfwStorage = (listType: ListTypes, defaultValue: "disabled" | "enabled") => {
  const [value, setValue] = useAsyncStorage(`nsfw-${listType}`, defaultValue);

  const toggle = useCallback(() => setValue(value === "enabled" ? "disabled" : "enabled"), [setValue, value]);

  return [value === "enabled", toggle] as const;
};

export const useNSFW = () => useContext(Context);

export const NSFWProvider = ({ children }: { children: React.ReactNode }) => {
  const [animeListNsfw, toggleAnimeListNsfw] = useNsfwStorage("anime-list", "enabled");
  const [seasonalAnimeNsfw, toggleSeasonalAnimeNsfw] = useNsfwStorage("seasonal-anime", "disabled");
  const [userAnimeListNsfw, toggleUserAnimeListNsfw] = useNsfwStorage("user-anime-list", "enabled");

  const values = useMemo(
    () => ({
      animeListNsfw,
      toggleAnimeListNsfw,
      seasonalAnimeNsfw,
      toggleSeasonalAnimeNsfw,
      userAnimeListNsfw,
      toggleUserAnimeListNsfw,
    }),
    [
      animeListNsfw,
      seasonalAnimeNsfw,
      toggleAnimeListNsfw,
      toggleSeasonalAnimeNsfw,
      toggleUserAnimeListNsfw,
      userAnimeListNsfw,
    ],
  );

  return <Context.Provider value={values}>{children}</Context.Provider>;
};
