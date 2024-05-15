import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { FlashList } from "@shopify/flash-list";
import { router } from "expo-router";
import { useCallback, useMemo, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, FAB, Icon, SegmentedButtons, Text } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import type { AnimeNode, Season, SeasonalAnimeSort } from "@/api";
import { getSeason, useSeasonalAnime } from "@/api";
import { Card, CardSummary, LoadingView, useAppTheme } from "@/components";

const seasonsList = [
  { value: "winter", label: "Winter" },
  { value: "spring", label: "Spring" },
  { value: "summer", label: "Summer" },
  { value: "fall", label: "Fall" },
];

const sortList = [
  { value: "anime_score", label: "Sort by Score" },
  { value: "anime_num_list_users", label: "Sort by Members" },
];

const Header = ({ season, year }: { season: Season; year: number }) => {
  const safeArea = useSafeAreaInsets();

  return (
    <View style={[{ marginTop: safeArea.top }, Styles.headerView]}>
      <Text variant="headlineSmall" style={Styles.headerText}>
        {season.toLocaleUpperCase()} {year}
      </Text>

      <Button mode="outlined" icon="magnify" style={{ flex: 1 }} onPress={() => router.push("/anime/search")}>
        Search
      </Button>
    </View>
  );
};

const Footer = ({ isLoading }: { isLoading: boolean }) => (
  <View style={{ height: 90 }}>{isLoading ? <LoadingView /> : null}</View>
);

const SeasonTab = () => {
  const [sort, setSort] = useState<SeasonalAnimeSort>("anime_num_list_users");
  const [year, setYear] = useState(new Date().getFullYear());
  const [season, setSeason] = useState(getSeason(new Date().getMonth()));

  const { colors } = useAppTheme();
  const safeArea = useSafeAreaInsets();
  const filterSheet = useRef<BottomSheetModal>(null);
  const { fetchNextPage, hasNextPage, data, isFetching, refetch } = useSeasonalAnime(year, season, { sort });

  const allItems = useMemo(
    () =>
      data?.pages
        .flatMap((page) => page.data)
        .filter(({ node }) => node.start_season?.year === year && node.start_season.season === season),
    [data?.pages, season, year],
  );

  const keyExtractor = useCallback(({ node }: { node: AnimeNode }, i: number) => `${i}-${node.id}`, []);

  const showFilterSheet = () => filterSheet.current?.present();

  return (
    <View style={{ flex: 1 }}>
      <FAB icon="filter" loading={isFetching} style={Styles.fab} onPress={showFilterSheet} />

      <BottomSheetModal
        ref={filterSheet}
        enableDynamicSizing
        stackBehavior="replace"
        handleIndicatorStyle={{ backgroundColor: colors.onSurface }}
        backgroundStyle={{ backgroundColor: colors.elevation.level2 }}
      >
        <BottomSheetView
          style={[{ backgroundColor: colors.elevation.level2, paddingBottom: safeArea.bottom }, Styles.bottomSheetView]}
        >
          <View style={Styles.bottomSheetYearView}>
            <Button mode="outlined" onPress={() => setYear((y) => y - 1)}>
              <Icon source="minus" size={20} color={colors.primary} />
            </Button>
            <Text variant="titleLarge">{year}</Text>
            <Button mode="outlined" onPress={() => setYear((y) => y + 1)}>
              <Icon source="plus" size={20} color={colors.primary} />
            </Button>
          </View>

          <SegmentedButtons buttons={seasonsList} value={season} onValueChange={(v) => setSeason(v as Season)} />
          <SegmentedButtons buttons={sortList} value={sort} onValueChange={(v) => setSort(v as SeasonalAnimeSort)} />

          <Button mode="contained" style={{ marginBottom: 30 }} onPress={() => filterSheet.current?.close()}>
            Set Filters
          </Button>
        </BottomSheetView>
      </BottomSheetModal>

      <FlashList
        data={allItems}
        numColumns={3}
        contentContainerStyle={{ paddingHorizontal: 10 }}
        estimatedItemSize={60}
        refreshing={isFetching}
        onRefresh={refetch}
        onEndReached={hasNextPage ? fetchNextPage : undefined}
        onEndReachedThreshold={0.5}
        ListHeaderComponent={() => <Header season={season} year={year} />}
        ListFooterComponent={() => <Footer isLoading={isFetching} />}
        keyExtractor={keyExtractor}
        renderItem={({ item: { node } }) => (
          <Card
            animeId={node.id}
            orientation="vertical"
            imageSource={node.main_picture.large ?? node.main_picture.medium}
          >
            <CardSummary title={node.title} meanScore={node.mean} mediaType={node.media_type} />
          </Card>
        )}
      />
    </View>
  );
};

const Styles = StyleSheet.create({
  headerView: {
    flex: 1,
    gap: 20,
    paddingTop: 15,
    margin: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerText: { flex: 1, fontStyle: "italic", fontWeight: "bold" },

  fab: { position: "absolute", margin: 16, right: 0, bottom: 0, zIndex: 1 },

  bottomSheetView: {
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 30,
    gap: 30,
  },
  bottomSheetYearView: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 30,
  },
});

export default SeasonTab;
