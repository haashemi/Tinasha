import { FlashList } from "@shopify/flash-list";
import { router, useNavigation } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { KeyboardAvoidingView, View } from "react-native";
import { ActivityIndicator, Searchbar, Text } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDebounce } from "use-debounce";

import { AnimeNode, useAnimeList } from "@/api";
import { AnimeListView, LoadingView } from "@/components";

export default function Search() {
  const safeArea = useSafeAreaInsets();
  const navigation = useNavigation();

  const [searchQuery, setSearchQuery] = useState("");
  const [q] = useDebounce(searchQuery, 500);

  const { fetchNextPage, hasNextPage, data, isSuccess, isFetching, isError } = useAnimeList({ q });

  const allItems = useMemo(() => data?.pages.flatMap((page) => page.data), [data]);

  const keyExtractor = useCallback((item: { node: AnimeNode }, i: number) => `${i}-${item.node.id}`, []);

  const [paddingTop, paddingBottom] = [safeArea.top + 80, safeArea.bottom + 20];

  return (
    <>
      <View style={{ position: "absolute", width: "100%", zIndex: 1, top: safeArea.top + 10, paddingHorizontal: 10 }}>
        <Searchbar
          autoFocus
          icon="arrow-left"
          onIconPress={() => navigation.goBack()}
          placeholder="Search"
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={{ flex: 1 }}
        />
      </View>

      {q !== "" && isSuccess && allItems?.length ? (
        <FlashList
          data={allItems}
          contentContainerStyle={{ paddingHorizontal: 10, paddingTop, paddingBottom }}
          estimatedItemSize={100}
          onEndReached={hasNextPage ? fetchNextPage : undefined}
          onEndReachedThreshold={0.5}
          ListFooterComponent={() => hasNextPage && isFetching && <LoadingView style={{ paddingVertical: 20 }} />}
          keyExtractor={keyExtractor}
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
              onPressEdit={() => router.push({ pathname: `/anime/edit`, params: { nodeJson: JSON.stringify(node) } })}
            />
          )}
        />
      ) : (
        <KeyboardAvoidingView
          enabled
          behavior="height"
          style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingTop, paddingBottom }}
        >
          {!searchQuery || !q ? (
            <Text variant="bodyLarge">Search for something</Text>
          ) : isFetching ? (
            <ActivityIndicator size="large" />
          ) : isError ? (
            <Text variant="bodyLarge">Error ocurred</Text>
          ) : (
            <Text variant="bodyLarge">No results</Text>
          )}
        </KeyboardAvoidingView>
      )}
    </>
  );
}
