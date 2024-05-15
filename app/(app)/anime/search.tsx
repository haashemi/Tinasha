import { FlashList } from "@shopify/flash-list";
import { useNavigation } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { KeyboardAvoidingView, View } from "react-native";
import { ActivityIndicator, Searchbar, Text } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDebounce } from "use-debounce";

import type { AnimeNode } from "@/api";
import { useAnimeList } from "@/api";
import { Card, CardDetails, LoadingScreen } from "@/components";

const SearchScreen = () => {
  const safeArea = useSafeAreaInsets();
  const navigation = useNavigation();

  const [searchQuery, setSearchQuery] = useState("");
  const [q] = useDebounce(searchQuery, 500);

  const { fetchNextPage, hasNextPage, data, isSuccess, isFetching, isError } = useAnimeList({ q });

  const allItems = useMemo(() => data?.pages.flatMap((page) => page.data), [data]);

  const keyExtractor = useCallback((item: { node: AnimeNode }, i: number) => `${i}-${item.node.id}`, []);

  const [marginTop, paddingBottom] = [safeArea.top + 35, safeArea.bottom + 20];

  return (
    <>
      <View style={{ position: "absolute", width: "100%", zIndex: 1, top: safeArea.top + 5, paddingHorizontal: 10 }}>
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
        <View style={{ flex: 1, marginTop }}>
          <FlashList
            data={allItems}
            contentContainerStyle={{ paddingHorizontal: 10, paddingTop: 30, paddingBottom }}
            estimatedItemSize={100}
            onEndReached={hasNextPage ? fetchNextPage : undefined}
            onEndReachedThreshold={0.5}
            ListFooterComponent={() => hasNextPage && isFetching && <LoadingScreen style={{ paddingVertical: 20 }} />}
            keyExtractor={keyExtractor}
            renderItem={({ item: { node } }) => (
              <Card
                animeId={node.id}
                imageSource={node.main_picture.large ?? node.main_picture.medium}
                style={{ marginVertical: 5 }}
              >
                <CardDetails
                  animeId={node.id}
                  title={node.title}
                  status={node.my_list_status?.status}
                  score={node.my_list_status?.score}
                  meanScore={node.mean}
                  totalEpisodes={node.num_episodes}
                  watchedEpisodes={node.my_list_status?.num_episodes_watched}
                />
              </Card>
            )}
          />
        </View>
      ) : (
        <KeyboardAvoidingView
          enabled
          behavior="height"
          style={{ flex: 1, justifyContent: "center", alignItems: "center", marginTop, paddingBottom }}
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
};

export default SearchScreen;
