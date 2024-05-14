import { router, Stack, useLocalSearchParams } from "expo-router";
import ContentLoader, { Rect } from "react-content-loader/native";
import { ScrollView, Share, StyleSheet, View } from "react-native";
import { Chip, FAB, Icon, IconButton, Text } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import type { AlternativeTitles, AnimeStudio } from "@/api";
import { useAnimeCharacters, useAnimeDetails } from "@/api";
import { AnimeCharactersView, Image, useAppTheme } from "@/components";
import { getAiringStatus, getMediaType, getNormalizedSeason, getSource } from "@/lib";

// TODO: Code Cleanup
// TODO: Statistics View
const AnimeDetailsScreen = () => {
  const safeArea = useSafeAreaInsets();

  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors, fonts, roundness } = useAppTheme();

  const { data, isSuccess } = useAnimeDetails({ animeId: id });
  const characters = useAnimeCharacters({ animeId: id });

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: data?.title ?? "Loading...",
          headerRight: () => (
            <IconButton
              icon="share-variant"
              onPress={() => Share.share({ title: data?.title, message: `https://myanimelist.net/anime/${id}` })}
            />
          ),
        }}
      />

      {data ? (
        <FAB
          disabled={!data}
          icon="playlist-edit"
          style={[Styles.fab, { bottom: safeArea.bottom + 10 }]}
          onPress={() => router.push(`/anime/${data.id}/edit`)}
        />
      ) : null}

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, gap: 15, paddingBottom: safeArea.bottom + 80 }}>
        <View style={Styles.detailsView}>
          <Image
            source={data?.main_picture.large ?? data?.main_picture.medium}
            style={{ height: 200, aspectRatio: "4/6", borderRadius: roundness * 3 }}
          />

          <View style={{ flex: 1, flexGrow: 1, height: "100%", paddingVertical: 10, gap: 10 }}>
            <View style={{ flexWrap: "wrap", gap: 5, flexDirection: "row" }}>
              <Chip style={{ flex: 1, backgroundColor: "transparent" }} compact icon="fire">
                {data?.popularity ?? "N/A"}
              </Chip>
              <Chip style={{ flex: 1, backgroundColor: "transparent" }} compact icon="star">
                {data?.mean ?? "N/A"}
              </Chip>
            </View>

            <View style={{ flexWrap: "wrap", gap: 5, flexDirection: "row" }}>
              <Chip style={{ flex: 1, backgroundColor: "transparent" }} compact icon="television-classic">
                {`${getMediaType(data?.media_type ?? "N/A")} - ${((data?.average_episode_duration ?? 0) / 60).toFixed(0)}m`}
              </Chip>
              <Chip style={{ flex: 1, backgroundColor: "transparent" }} compact icon="movie-roll">
                {data?.num_episodes ? `${data.num_episodes} EP` : "?? EP"}
              </Chip>
            </View>

            <View style={{ flexWrap: "wrap", gap: 5, flexDirection: "row" }}>
              <Chip style={{ flex: 1, backgroundColor: "transparent" }} compact icon="calendar-month">
                {getNormalizedSeason(data?.start_season?.season)} {data?.start_season?.year ?? "0000"}
              </Chip>
              <Chip style={{ flex: 1, backgroundColor: "transparent" }} compact icon="satellite-variant">
                {getAiringStatus(data?.status)}
              </Chip>
            </View>

            <View style={{ flexDirection: "row", gap: 5, paddingLeft: 8, marginRight: 20 }}>
              <Icon source="drama-masks" size={20} color={colors.primary} />
              <Text
                numberOfLines={3}
                adjustsFontSizeToFit
                style={{ ...fonts.labelLarge, color: colors.onPrimaryContainer }}
              >
                {data?.genres.map((v) => v.name).join(", ") ?? "N/A"}
              </Text>
            </View>
          </View>
        </View>

        {isSuccess ? (
          <>
            <ProductionDetailsView studios={data?.studios ?? "Unknown"} source={data?.source ?? "Unknown"} />
            <AlternativeTitlesView data={data?.alternative_titles} />
          </>
        ) : (
          <ContentLoader
            width="100%"
            height={265}
            backgroundColor={colors.elevation.level1}
            foregroundColor={colors.elevation.level3}
          >
            <Rect x="0" y="000" rx="12" ry="12" width="100%" height="100" />
            <Rect x="0" y="115" rx="12" ry="12" width="100%" height="150" />
          </ContentLoader>
        )}

        <AnimeCharactersView isLoading={characters.isLoading} characters={characters.data?.data} />
      </ScrollView>
    </>
  );
};

const ProductionDetailsView = ({ studios, source }: { studios: AnimeStudio[]; source: string }) => {
  const {
    colors: { elevation },
    roundness,
  } = useAppTheme();

  return (
    <View style={[Styles.productionDetailsView, { borderRadius: roundness * 3, backgroundColor: elevation.level1 }]}>
      <View style={[Styles.titledTextView, { justifyContent: "center", alignItems: "center" }]}>
        <Text variant="bodyMedium">Studios:</Text>
        <Text variant="titleMedium" style={[Styles.titledText, { paddingLeft: 0 }]} numberOfLines={2}>
          {studios.map((v) => v.name).join(", ") || "N/A"}
        </Text>
      </View>

      <View style={[Styles.titledTextView, { justifyContent: "center", alignItems: "center" }]}>
        <Text variant="bodyMedium">Source:</Text>
        <Text variant="titleMedium" style={[Styles.titledText, { paddingLeft: 0 }]} numberOfLines={1}>
          {getSource(source)}
        </Text>
      </View>
    </View>
  );
};

const AlternativeTitlesView = ({ data }: { data: AlternativeTitles }) => {
  const {
    colors: { elevation },
    roundness,
  } = useAppTheme();

  return (
    <View style={[Styles.alternativeTitlesView, { borderRadius: roundness * 3, backgroundColor: elevation.level1 }]}>
      <View style={Styles.titledTextView}>
        <Text variant="bodyMedium">English:</Text>
        <Text variant="titleMedium" style={Styles.titledText} numberOfLines={3}>
          {data.en ?? "Unknown"}
        </Text>
      </View>

      <View style={Styles.titledTextView}>
        <Text variant="bodyMedium">Native:</Text>
        <Text variant="titleMedium" style={Styles.titledText} numberOfLines={3}>
          {data.ja ?? "Unknown"}
        </Text>
      </View>
    </View>
  );
};

const Styles = StyleSheet.create({
  fab: { zIndex: 1, position: "absolute", margin: 16, right: 0 },

  detailsView: { paddingVertical: 25, flexDirection: "row", alignItems: "center", gap: 15 },

  titledTextView: { flex: 1, minHeight: 60, gap: 10 },
  titledText: { paddingLeft: 5 },

  productionDetailsView: { padding: 15, height: 100, flexDirection: "row" },
  alternativeTitlesView: { gap: 10, padding: 15, height: 150 },
});

export default AnimeDetailsScreen;
