import { Image } from "expo-image";
import * as WebBrowser from "expo-web-browser";
import { useState } from "react";
import { FlatList, ScrollView, View } from "react-native";
import { Searchbar, SegmentedButtons, Surface, Text, TouchableRipple } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { getSeason, useSessionalAnime } from "@/api";

export default function ListTab() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("watching");

  const [year] = useState(new Date().getFullYear());
  const [season] = useState(getSeason(new Date().getMonth()));
  const safeArea = useSafeAreaInsets();
  const { data, isSuccess } = useSessionalAnime({ year, season, fields: ["start_season", "alternative_titles"] });

  const items = isSuccess
    ? data.data.filter(
        ({ node }) =>
          node.start_season!.year === year &&
          node.start_season!.season === season &&
          (query !== ""
            ? node.title.toLowerCase().includes(query) ||
              node.alternative_titles?.en.toLowerCase().includes(query) ||
              node.alternative_titles?.ja.toLowerCase().includes(query) ||
              node.alternative_titles?.synonyms.find((v) => (v.toLowerCase().includes(query) ? v : undefined)) !==
                undefined
            : true),
      )
    : [];

  return (
    <>
      <View style={{ gap: 15, marginTop: safeArea.top }}>
        <Searchbar value={query} onChangeText={setQuery} style={{ marginTop: 10, marginHorizontal: 10 }} />

        <ScrollView showsHorizontalScrollIndicator={false} horizontal style={{ marginBottom: 15 }}>
          <SegmentedButtons
            value={status}
            onValueChange={setStatus}
            buttons={[
              { value: "all", label: "All" },
              { value: "watching", label: "Watching" },
              { value: "completed", label: "Completed" },
              { value: "on_hold", label: "On Hold" },
              { value: "dropped", label: "Dropped" },
              { value: "plan_to_watch", label: "Plan to Watch" },
            ]}
            style={{ paddingHorizontal: 15 }}
          />
        </ScrollView>
      </View>

      <FlatList
        data={items}
        style={{ paddingHorizontal: 10 }}
        contentContainerStyle={{ gap: 15 }}
        keyExtractor={(item) => item.node.id.toString()}
        renderItem={({ item: { node } }) => (
          <TouchableRipple
            key={node.id.toString()}
            borderless
            onLongPress={async () => {
              await WebBrowser.openBrowserAsync(`https://myanimelist.net/anime/${node.id}`);
            }}
            style={{ borderCurve: "continuous", borderRadius: 10, overflow: "hidden", flex: 1 }}
          >
            <Surface mode="flat" style={{ height: 100, flexDirection: "row" }}>
              <Image style={{ width: 100 }} source={node.main_picture.large} contentFit="cover" transition={250} />
              <Text numberOfLines={2} ellipsizeMode="tail" style={{ padding: 5 }}>
                {node.title}
              </Text>
            </Surface>
          </TouchableRipple>
        )}
      />
    </>
  );
}
