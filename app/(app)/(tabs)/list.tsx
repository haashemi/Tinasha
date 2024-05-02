import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { FlashList } from "@shopify/flash-list";
import { Link } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Status, useUserAnimeList } from "@/api";
import { AnimeListView, LazyLoader, useAppTheme } from "@/components";

const Tab = createMaterialTopTabNavigator();

// TODO: Use infinite query to fetch everything...
const ListView = ({ status }: { status?: Status }) => {
  const { data, isFetching, refetch } = useUserAnimeList("@me", {
    sort: "anime_title",
    status: status ? status : undefined,
    limit: 100,
    fields: ["alternative_titles", "num_episodes", "mean", "my_list_status"],
  });

  return (
    <FlashList
      data={data?.data}
      contentContainerStyle={{ paddingVertical: 10, paddingHorizontal: 10 }}
      estimatedItemSize={30}
      refreshing={isFetching}
      onRefresh={refetch}
      keyExtractor={(item) => item.node.id.toString()}
      renderItem={({ item: { node } }) => (
        <Link asChild href={`/anime/${node.id}`}>
          <AnimeListView
            title={node.title}
            status={node.my_list_status?.status}
            score={node.my_list_status?.score}
            meanScore={node.mean}
            totalEpisodes={node.num_episodes}
            style={{ margin: 5 }}
            watchedEpisodes={node.my_list_status?.num_episodes_watched}
            imageSrc={node.main_picture?.large ?? node.main_picture?.medium}
            onLongPress={async () => WebBrowser.openBrowserAsync(`https://myanimelist.net/anime/${node.id}`)}
          />
        </Link>
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
