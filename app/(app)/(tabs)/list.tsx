import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { FlashList } from "@shopify/flash-list";
import { useCallback, useMemo } from "react";
import { ProgressBar } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Status, UserAnimeListEdge, useUserAnimeList } from "@/api";
import { AnimeListView, LazyLoader, useAppTheme } from "@/components";

const Tab = createMaterialTopTabNavigator();

const ListView = ({ status }: { status?: Status }) => {
  const { fetchNextPage, hasNextPage, data, isFetching, refetch } = useUserAnimeList({ status });

  const allItems = useMemo(() => data?.pages.flatMap((page) => page.data), [data]);

  const keyExtractor = useCallback((item: UserAnimeListEdge, i: number) => `${i}-${item.node.id}`, []);

  return (
    <FlashList
      data={allItems}
      contentContainerStyle={{ paddingVertical: 10, paddingHorizontal: 10 }}
      estimatedItemSize={300}
      refreshing={isFetching}
      onRefresh={refetch}
      onEndReached={hasNextPage ? fetchNextPage : undefined}
      onEndReachedThreshold={0.5}
      ListFooterComponent={() => (hasNextPage && isFetching ? <ProgressBar indeterminate /> : null)}
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
        />
      )}
    />
  );
};

export default function ListTab() {
  const { colors } = useAppTheme();
  const safeArea = useSafeAreaInsets();

  return (
    <>
      <Tab.Navigator
        initialRouteName="Watching"
        screenOptions={{
          lazy: true,
          lazyPlaceholder: LazyLoader,
          tabBarGap: 20,
          tabBarScrollEnabled: true,
          tabBarStyle: {
            marginTop: safeArea.top,
            paddingHorizontal: 16,
            backgroundColor: colors.background,
            shadowColor: "transparent",
          },
          tabBarIndicatorContainerStyle: { marginHorizontal: 16 },
          tabBarItemStyle: { width: "auto", paddingHorizontal: 10 },
          tabBarLabelStyle: { marginHorizontal: 0 },
        }}
      >
        <Tab.Screen name="All">{() => <ListView />}</Tab.Screen>
        <Tab.Screen name="Watching">{() => <ListView status="watching" />}</Tab.Screen>
        <Tab.Screen name="Completed">{() => <ListView status="completed" />}</Tab.Screen>
        <Tab.Screen name="On Hold">{() => <ListView status="on_hold" />}</Tab.Screen>
        <Tab.Screen name="Dropped">{() => <ListView status="dropped" />}</Tab.Screen>
        <Tab.Screen name="Plan to Watch">{() => <ListView status="plan_to_watch" />}</Tab.Screen>
      </Tab.Navigator>
    </>
  );
}
