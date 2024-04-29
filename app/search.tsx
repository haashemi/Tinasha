import { Image } from "expo-image";
import { useNavigation } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useState } from "react";
import { View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { Searchbar, Surface, Text, TouchableRipple } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDebounce } from "use-debounce";

import { useAnimeList } from "@/api";

export default function Search() {
  const safeArea = useSafeAreaInsets();
  const navigation = useNavigation();

  const [searchQuery, setSearchQuery] = useState("");
  const [query] = useDebounce(searchQuery, 500);

  const { data, isLoading, isError } = useAnimeList({ query });

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

      <FlatList
        data={data?.data}
        contentContainerStyle={{
          gap: 10,
          paddingHorizontal: 10,
          paddingTop: safeArea.top + 80,
          paddingBottom: safeArea.bottom + 20,
        }}
        keyExtractor={(item) => item.node.id.toString()}
        ListEmptyComponent={() => (
          <View style={{ justifyContent: "center", alignItems: "center" }}>
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
        renderItem={({ item: { node } }) => (
          <TouchableRipple
            key={node.id.toString()}
            borderless
            onLongPress={async () => {
              await WebBrowser.openBrowserAsync(`https://myanimelist.net/anime/${node.id}`);
            }}
            style={{ borderRadius: 10, overflow: "hidden", flex: 1 }}
          >
            <Surface mode="flat" style={{ height: 100, flexDirection: "row" }}>
              <Image
                style={{ height: 100, width: 100 }}
                source={node.main_picture ? node.main_picture.large || node.main_picture.medium : null}
                contentFit="cover"
                transition={250}
              />
              <View>
                <Text numberOfLines={2} ellipsizeMode="tail">
                  {node.title}
                </Text>
              </View>
            </Surface>
          </TouchableRipple>
        )}
      />
    </>
  );
}
