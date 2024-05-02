import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { FlashList } from "@shopify/flash-list";
import { Link } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Status, useUserAnimeList } from "@/api";
import { AnimeListView, useAppTheme } from "@/components";

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

const ListViewAll = () => <ListView />;

const ListViewWatching = () => <ListView status="watching" />;

const ListViewCompleted = () => <ListView status="completed" />;

const ListViewOnHold = () => <ListView status="on_hold" />;

const ListViewDropped = () => <ListView status="dropped" />;

const ListViewPlanToWatch = () => <ListView status="plan_to_watch" />;

export default function ListTab() {
  const { colors } = useAppTheme();
  const safeArea = useSafeAreaInsets();

  return (
    <>
      <Tab.Navigator
        initialRouteName="Watching"
        screenOptions={{
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
        <Tab.Screen name="All" component={ListViewAll} />
        <Tab.Screen name="Watching" component={ListViewWatching} />
        <Tab.Screen name="Completed" component={ListViewCompleted} />
        <Tab.Screen name="On Hold" component={ListViewOnHold} />
        <Tab.Screen name="Dropped" component={ListViewDropped} />
        <Tab.Screen name="Plan to Watch" component={ListViewPlanToWatch} />
      </Tab.Navigator>
    </>
  );
}
