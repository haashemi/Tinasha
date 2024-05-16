import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { FlashList } from "@shopify/flash-list";
import { useCallback, useMemo } from "react";
import { StyleSheet } from "react-native";
import { ProgressBar } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import type { UserAnimeListEdge, WatchingStatus } from "@/api";
import { useUserAnimeList } from "@/api";
import { LoadingScreen } from "@/components";
import { Card, CardDetails } from "@/components/Card";
import { useAppTheme, useNSFW } from "@/context";

const Tab = createMaterialTopTabNavigator();

const ListView = ({ status }: { status?: WatchingStatus }) => {
  const { userAnimeListNsfw } = useNSFW();
  const { fetchNextPage, hasNextPage, data, isFetching, refetch } = useUserAnimeList({
    status,
    nsfw: userAnimeListNsfw,
  });

  const allItems = useMemo(() => data?.pages.flatMap((page) => page.data), [data]);

  const keyExtractor = useCallback((item: UserAnimeListEdge, i: number) => `${i}-${item.node.id}`, []);

  return (
    <FlashList
      data={allItems}
      contentContainerStyle={styles.listContainer}
      estimatedItemSize={300}
      refreshing={isFetching}
      onRefresh={refetch}
      onEndReached={hasNextPage ? fetchNextPage : undefined}
      onEndReachedThreshold={0.5}
      ListFooterComponent={() => (hasNextPage && isFetching ? <ProgressBar indeterminate /> : null)}
      keyExtractor={keyExtractor}
      renderItem={({ item: { node } }) => (
        <Card
          animeId={node.id}
          imageSource={node.main_picture.large ?? node.main_picture.medium}
          style={styles.listCard}
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
  );
};

const ListTab = () => {
  const { colors } = useAppTheme();
  const safeArea = useSafeAreaInsets();

  return (
    <Tab.Navigator
      initialRouteName="Watching"
      screenOptions={{
        lazy: true,
        lazyPlaceholder: () => <LoadingScreen />,
        tabBarGap: 20,
        tabBarScrollEnabled: true,
        tabBarStyle: [styles.tabBar, { marginTop: safeArea.top, backgroundColor: colors.background }],
        tabBarItemStyle: styles.tabBarItem,
      }}
    >
      <Tab.Screen name="All">{() => <ListView />}</Tab.Screen>
      <Tab.Screen name="Watching">{() => <ListView status="watching" />}</Tab.Screen>
      <Tab.Screen name="Completed">{() => <ListView status="completed" />}</Tab.Screen>
      <Tab.Screen name="On Hold">{() => <ListView status="on_hold" />}</Tab.Screen>
      <Tab.Screen name="Dropped">{() => <ListView status="dropped" />}</Tab.Screen>
      <Tab.Screen name="Plan to Watch">{() => <ListView status="plan_to_watch" />}</Tab.Screen>
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: { shadowColor: "transparent" },
  tabBarItem: { width: "auto" },

  listContainer: { paddingVertical: 10, paddingHorizontal: 10 },
  listCard: { marginVertical: 5 },
});

export default ListTab;
