import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import { Link } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useRef, useState } from "react";
import { Pressable, View } from "react-native";
import { Button, Chip, FAB, Icon, SegmentedButtons, Surface, Text, TouchableRipple } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Season, getSeason, useSeasonalAnime } from "@/api";
import { useAppTheme } from "@/components";
import { getStatusColor } from "@/lib";

// TODO: totally rewrite this page.
// TODO: use useInfiniteQuery instead of useQuery
export default function SeasonTab() {
  const [sort, setSort] = useState<"anime_score" | "anime_num_list_users">("anime_num_list_users");
  const [year, setYear] = useState(new Date().getFullYear());
  const [season, setSeason] = useState(getSeason(new Date().getMonth()));

  const theme = useAppTheme();
  const safeArea = useSafeAreaInsets();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const { data, isSuccess, isFetching, refetch } = useSeasonalAnime({ year, season, sort });

  const items = isSuccess
    ? data.data.filter(({ node }) => node.start_season!.year === year && node.start_season!.season === season)
    : [];

  return (
    <>
      <FAB
        icon="filter"
        mode="flat"
        disabled={!isSuccess}
        loading={!isSuccess}
        variant="secondary"
        style={{ position: "absolute", margin: 16, right: 0, bottom: 0, zIndex: 50 }}
        onPress={() => bottomSheetModalRef.current?.present()}
      />

      <BottomSheetModal
        ref={bottomSheetModalRef}
        enableDynamicSizing
        stackBehavior="replace"
        handleIndicatorStyle={{ backgroundColor: theme.colors.onSurface }}
        backgroundStyle={{ backgroundColor: theme.colors.elevation.level3 }}
      >
        <BottomSheetView
          style={{
            backgroundColor: theme.colors.elevation.level3,
            alignItems: "center",
            justifyContent: "space-around",
            paddingHorizontal: 30,
            paddingBottom: safeArea.bottom,
            gap: 30,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              width: "100%",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 30,
            }}
          >
            <Button mode="outlined" onPress={() => setYear((y) => y - 1)}>
              <Icon source="minus" size={20} color={theme.colors.primary} />
            </Button>

            <Text variant="titleLarge">{year}</Text>

            <Button mode="outlined" onPress={() => setYear((y) => y + 1)}>
              <Icon source="plus" size={20} color={theme.colors.primary} />
            </Button>
          </View>

          <SegmentedButtons
            value={season}
            onValueChange={(v) => setSeason(v as Season)}
            buttons={[
              { value: "winter", label: "Winter" },
              { value: "spring", label: "Spring" },
              { value: "summer", label: "Summer" },
              { value: "fall", label: "Fall" },
            ]}
          />

          <SegmentedButtons
            value={sort}
            onValueChange={(v) => setSort(v as "anime_score" | "anime_num_list_users")}
            buttons={[
              { value: "anime_score", label: "Sort by Score" },
              { value: "anime_num_list_users", label: "Sort by Members" },
            ]}
          />

          <Button mode="contained" style={{ marginBottom: 30 }} onPress={() => bottomSheetModalRef.current?.close()}>
            Set Filters
          </Button>
        </BottomSheetView>
      </BottomSheetModal>

      <FlashList
        data={items}
        numColumns={3}
        estimatedItemSize={30}
        refreshing={isFetching}
        onRefresh={refetch}
        contentContainerStyle={{ paddingHorizontal: 10, paddingBottom: 90 }}
        ListHeaderComponent={() => (
          <View
            style={{
              flex: 1,
              gap: 20,
              marginTop: safeArea.top,
              paddingTop: 15,
              margin: 15,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text variant="headlineSmall" style={{ flex: 1, fontStyle: "italic", fontWeight: "bold" }}>
              {season.toLocaleUpperCase()} {year}
            </Text>

            <Link asChild href="/search">
              <Button mode="outlined" icon="magnify" style={{ flex: 1 }} onPress={() => {}}>
                Search
              </Button>
            </Link>
          </View>
        )}
        keyExtractor={(item) => item.node.id.toString()}
        renderItem={({ item: { node } }) => (
          <Link asChild href={`/anime/details/${node.id}`}>
            <TouchableRipple
              borderless
              onLongPress={async () => {
                await WebBrowser.openBrowserAsync(`https://myanimelist.net/anime/${node.id}`);
              }}
              style={{ borderRadius: 10, overflow: "hidden", flex: 1 }}
            >
              <Surface
                mode="flat"
                elevation={2}
                style={{ height: 260, margin: 5, borderRadius: 10, overflow: "hidden" }}
              >
                <Image
                  transition={250}
                  allowDownscaling
                  cachePolicy="memory-disk"
                  contentFit="fill"
                  source={node.main_picture?.large}
                  style={{ height: 170 }}
                />

                <View style={{ padding: 5, flex: 1, justifyContent: "space-between" }}>
                  <Text variant="titleMedium" numberOfLines={2} ellipsizeMode="tail">
                    {node.title}
                  </Text>

                  <View style={{ flexDirection: "row", gap: 5 }}>
                    <Chip compact icon="star" style={{ flexGrow: 1 }}>
                      {node.mean! || "N/A"}
                    </Chip>
                    <Link asChild href={`/anime/edit/${node.id}`}>
                      <Pressable
                        style={{
                          borderRadius: 5,
                          justifyContent: "center",
                          alignItems: "center",
                          padding: 5,
                          backgroundColor: getStatusColor(node.my_list_status?.status),
                        }}
                      >
                        <Icon size={20} color="white" source="list-status" />
                      </Pressable>
                    </Link>
                  </View>
                </View>
              </Surface>
            </TouchableRipple>
          </Link>
        )}
      />
    </>
  );
}
