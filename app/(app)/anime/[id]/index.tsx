import { Image } from "expo-image";
import { Stack, router, useLocalSearchParams } from "expo-router";
import ContentLoader, { Rect } from "react-content-loader/native";
import { ScrollView, Share, StyleSheet, View } from "react-native";
import { Chip, FAB, Icon, IconButton, Text } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AnimeStudio, useAnimeCharacters, useAnimeDetails } from "@/api";
import { AlternativeTitles } from "@/api/models/AlternativeTitles";
import { AnimeCharactersView, TitledText, useAppTheme } from "@/components";
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
          headerRight: () => {
            return (
              <IconButton
                icon="share-variant"
                onPress={() => Share.share({ title: data?.title, message: `https://myanimelist.net/anime/${id}` })}
              />
            );
          },
        }}
      />

      {data && (
        <FAB
          disabled={!data}
          icon="playlist-edit"
          style={Styles.fab}
          onPress={() => router.push(`/anime/${data.id}/edit`)}
        />
      )}

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, gap: 15, paddingBottom: safeArea.bottom + 80 }}>
        <View style={Styles.detailsView}>
          <Image
            recyclingKey={`${data?.id}-${data?.title}`}
            source={data?.main_picture.large || data?.main_picture.medium}
            style={{ height: 200, aspectRatio: "4/6", borderRadius: roundness * 3 }}
            contentFit="cover"
            transition={100}
          />

          <View style={{ flex: 1, flexGrow: 1, height: "100%", paddingVertical: 10, gap: 10 }}>
            <View style={{ flexWrap: "wrap", gap: 5, flexDirection: "row" }}>
              <Chip style={{ flex: 1, backgroundColor: "transparent" }} compact icon="fire">
                {data?.popularity || "N/A"}
              </Chip>
              <Chip style={{ flex: 1, backgroundColor: "transparent" }} compact icon="star">
                {data?.mean || "N/A"}
              </Chip>
            </View>

            <View style={{ flexWrap: "wrap", gap: 5, flexDirection: "row" }}>
              <Chip style={{ flex: 1, backgroundColor: "transparent" }} compact icon="television-classic">
                {`${getMediaType(data?.media_type || "N/A")} - ${((data?.average_episode_duration || 0) / 60).toFixed(0)}m`}
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
                {data?.genres.map((v) => v.name).join(", ") || "N/A"}
              </Text>
            </View>
          </View>
        </View>

        {isSuccess ? (
          <>
            <ProductionDetailsView studios={data.studios} source={data.source ?? "Unknown"} />
            <AlternativeTitlesView data={data.alternative_titles} />
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
      <TitledText
        style={{ justifyContent: "center", alignItems: "center" }}
        title="Studios"
        text={studios.map((v) => v.name).join(", ") || "N/A"}
        textProps={{ numberOfLines: 2 }}
      />
      <TitledText
        style={{ justifyContent: "center", alignItems: "center" }}
        title="Source"
        text={getSource(source)}
        textProps={{ numberOfLines: 1 }}
      />
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
      <TitledText title="Enlgish" text={data.en || "Unknown"} textProps={{ numberOfLines: 1 }} />
      <TitledText title="Native" text={data.ja || "Unknown"} textProps={{ numberOfLines: 1 }} />
    </View>
  );
};

const Styles = StyleSheet.create({
  fab: { zIndex: 1, position: "absolute", margin: 16, right: 0, bottom: 10 },

  detailsView: { paddingVertical: 25, flexDirection: "row", alignItems: "center", gap: 15 },

  productionDetailsView: { padding: 15, height: 100, flexDirection: "row" },
  alternativeTitlesView: { gap: 10, padding: 15, height: 150 },
});

export default AnimeDetailsScreen;
