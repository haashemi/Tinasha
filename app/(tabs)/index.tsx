import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { Image } from "expo-image";
import { Link } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useRef, useState } from "react";
import { FlatList, View } from "react-native";
import { Button, Chip, FAB, Icon, SegmentedButtons, Surface, Text, TouchableRipple } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Season, getSeason, useSeasonalAnime } from "@/api";
import { useAppTheme } from "@/components";

export default function SeasonTab() {
  const [sort, setSort] = useState<"anime_score" | "anime_num_list_users">("anime_score");
  const [year, setYear] = useState(new Date().getFullYear());
  const [season, setSeason] = useState(getSeason(new Date().getMonth()));

  const theme = useAppTheme();
  const safeArea = useSafeAreaInsets();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const { data, isSuccess } = useSeasonalAnime({ year, season, sort });

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

      <FlatList
        data={items}
        numColumns={3}
        style={{ paddingHorizontal: 10 }}
        columnWrapperStyle={{ gap: 15 }}
        contentContainerStyle={{ gap: 15, paddingBottom: 90 }}
        ListHeaderComponent={() => (
          <View
            style={{
              flex: 1,
              gap: 20,
              marginTop: safeArea.top,
              paddingTop: 15,
              marginHorizontal: 25,
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
          <TouchableRipple
            borderless
            onLongPress={async () => {
              await WebBrowser.openBrowserAsync(`https://myanimelist.net/anime/${node.id}`);
            }}
            style={{ borderRadius: 10, overflow: "hidden", flex: 1 }}
          >
            <Surface mode="flat" elevation={2} style={{ height: 260 }}>
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

                <Chip compact icon="star">
                  {node.mean! || "N/A"}
                </Chip>
              </View>
            </Surface>
          </TouchableRipple>
        )}
      />
    </>
  );
}
