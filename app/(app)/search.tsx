import { FlashList } from "@shopify/flash-list";
import { useNavigation } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import { Searchbar, Text } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDebounce } from "use-debounce";

import { useAnimeList } from "@/api";
import { AnimeListView } from "@/components";

// TODO: Show a proper loading state
// TODO: use useInfiniteQuery instead of useQuery
// TODO: cleanup styles
export default function Search() {
  const safeArea = useSafeAreaInsets();
  const navigation = useNavigation();

  const [searchQuery, setSearchQuery] = useState("");
  const [query] = useDebounce(searchQuery, 500);

  const { data, isLoading, isError } = useAnimeList({
    query,
    fields: ["alternative_titles", "num_episodes", "mean", "my_list_status"],
  });

  return (
    <>
      <Searchbar
        autoFocus
        icon="arrow-left"
        onIconPress={() => navigation.goBack()}
        placeholder="Search"
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={{ position: "absolute", zIndex: 1, top: safeArea.top + 10, marginHorizontal: 10 }}
      />

      <FlashList
        data={data?.data}
        contentContainerStyle={{
          paddingHorizontal: 10,
          paddingTop: safeArea.top + 80,
          paddingBottom: safeArea.bottom + 20,
        }}
        estimatedItemSize={30}
        ListEmptyComponent={() => (
          <View style={{ height: 200, justifyContent: "center", alignItems: "center" }}>
            <Text>
              {query === ""
                ? "Search for something"
                : isLoading
                  ? "Loading..."
                  : isError
                    ? "Failed to fetch"
                    : "Nothing was found"}
            </Text>
          </View>
        )}
        keyExtractor={(item) => item.node.id.toString()}
        renderItem={({ item: { node } }) => (
          <AnimeListView
            animeId={node.id}
            title={node.title}
            status={node.my_list_status?.status}
            score={node.my_list_status?.score}
            meanScore={node.mean}
            totalEpisodes={node.num_episodes}
            style={{ margin: 5 }}
            watchedEpisodes={node.my_list_status?.num_episodes_watched}
            imageSrc={node.main_picture?.large ?? node.main_picture?.medium}
          />
        )}
      />
    </>
  );
}
