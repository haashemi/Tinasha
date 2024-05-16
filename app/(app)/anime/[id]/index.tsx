import { Link, router, Stack, useLocalSearchParams } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useMemo } from "react";
import ContentLoader, { Rect } from "react-content-loader/native";
import { ScrollView, Share, StyleSheet, View } from "react-native";
import { Chip, Divider, FAB, Headline, IconButton, Text, TouchableRipple } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import type { AlternativeTitles, AnimeNode, AnimeStudio, CharacterNode, RelatedAnimeEdge } from "@/api";
import { useAnimeCharacters, useAnimeDetails } from "@/api";
import { Card, Image, LoadingScreen } from "@/components";
import { useAppTheme } from "@/context";
import { getAiringStatus, getMediaType, getNormalizedSeason, getSource, mergePictureUrls } from "@/lib";

interface AnimeCharactersViewProps {
  isLoading: boolean;
  characters?: { node: CharacterNode; role: string }[];
}

const MainDetailsView = ({ data }: { data: AnimeNode }) => {
  const { colors } = useAppTheme();

  return (
    <View style={{ flex: 1, flexGrow: 1, height: "100%", paddingVertical: 10 }}>
      <Divider />
      <View style={{ flexWrap: "wrap", paddingHorizontal: 15, gap: 5, flexDirection: "row" }}>
        <Chip style={{ flex: 1, paddingVertical: 10, backgroundColor: "transparent" }} compact icon="fire">
          {data.popularity}
        </Chip>

        <Divider style={{ width: 1, height: "100%" }} />

        <Chip style={{ flex: 1, paddingVertical: 10, backgroundColor: "transparent" }} compact icon="star">
          {data.mean ?? "N/A"}
        </Chip>
      </View>

      <Divider />

      <View style={{ flexWrap: "wrap", paddingHorizontal: 15, gap: 5, flexDirection: "row" }}>
        <Chip
          style={{ flex: 1, paddingVertical: 10, backgroundColor: "transparent" }}
          compact
          icon="television-classic"
        >
          {getMediaType(data.media_type)}
          {data.average_episode_duration && data.average_episode_duration > 0
            ? ` - ${(data.average_episode_duration / 60).toFixed(0)}m`
            : null}
        </Chip>

        <Divider style={{ width: 1, height: "100%" }} />

        <Chip style={{ flex: 1, paddingVertical: 10, backgroundColor: "transparent" }} compact icon="movie-roll">
          {data.num_episodes ? `${data.num_episodes} EP` : "?? EP"}
        </Chip>
      </View>

      <Divider />

      <View style={{ flexWrap: "wrap", paddingHorizontal: 15, gap: 5, flexDirection: "row" }}>
        <Chip style={{ flex: 1, paddingVertical: 10, backgroundColor: "transparent" }} compact icon="calendar-month">
          {getNormalizedSeason(data.start_season?.season)} {data.start_season?.year ?? "0000"}
        </Chip>

        <Divider style={{ width: 1, height: "100%" }} />

        <Chip style={{ flex: 1, paddingVertical: 10, backgroundColor: "transparent" }} compact icon="satellite-variant">
          {getAiringStatus(data.status)}
        </Chip>
      </View>

      <Divider />

      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 5,
          paddingTop: 15,
          paddingBottom: 5,
        }}
      >
        {data.genres.map((v) => (
          <Chip
            compact
            mode="flat"
            onPress={() => WebBrowser.openBrowserAsync(`https://myanimelist.net/anime/genre/${v.id}`)}
            style={{ borderWidth: 1, borderColor: colors.surfaceContainerHighest, backgroundColor: "transparent" }}
            key={v.id.toString()}
          >
            {v.name}
          </Chip>
        ))}
      </View>
    </View>
  );
};

const ProductionDetailsView = ({ studios, source }: { studios: AnimeStudio[]; source: string }) => {
  const { colors } = useAppTheme();

  return (
    <View style={[styles.productionDetailsView, { borderRadius: 12, backgroundColor: colors.elevation.level1 }]}>
      <View style={[styles.titledTextView, { justifyContent: "center", alignItems: "center" }]}>
        <Text variant="bodyMedium">Studios:</Text>
        <Text variant="titleMedium" style={[styles.titledText, { paddingLeft: 0 }]} numberOfLines={2}>
          {studios.map((v) => v.name).join(", ") || "N/A"}
        </Text>
      </View>

      <View style={[styles.titledTextView, { justifyContent: "center", alignItems: "center" }]}>
        <Text variant="bodyMedium">Source:</Text>
        <Text variant="titleMedium" style={[styles.titledText, { paddingLeft: 0 }]} numberOfLines={1}>
          {getSource(source)}
        </Text>
      </View>
    </View>
  );
};

const AlternativeTitlesView = ({ data }: { data: AlternativeTitles }) => {
  const { colors } = useAppTheme();

  return (
    <View style={[styles.alternativeTitlesView, { borderRadius: 12, backgroundColor: colors.elevation.level1 }]}>
      <View style={styles.titledTextView}>
        <Text variant="bodyMedium">English:</Text>
        <Text variant="titleMedium" style={styles.titledText} numberOfLines={3}>
          {data.en ?? "Unknown"}
        </Text>
      </View>

      <View style={styles.titledTextView}>
        <Text variant="bodyMedium">Native:</Text>
        <Text variant="titleMedium" style={styles.titledText} numberOfLines={3}>
          {data.ja ?? "Unknown"}
        </Text>
      </View>

      {data.synonyms && data.synonyms.length > 0 ? (
        <View style={styles.titledTextView}>
          <Text variant="bodyMedium">Synonyms:</Text>
          <Text variant="titleMedium" style={styles.titledText}>
            {data.synonyms.join("\n")}
          </Text>
        </View>
      ) : null}
    </View>
  );
};

// TODO: Add a placeholder for empty images.
const AnimeCharactersView = ({ isLoading, characters }: AnimeCharactersViewProps) => {
  const { colors } = useAppTheme();

  return (
    <View style={[ACStyles.mainView, { borderRadius: 12, backgroundColor: colors.elevation.level1 }]}>
      <Text variant="titleMedium" style={ACStyles.titleText}>
        Characters:
      </Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={ACStyles.scrollView}>
        {isLoading ? (
          <ContentLoader
            width={590}
            height={180}
            style={{ margin: 5 }}
            viewBox="0 0 590 180"
            backgroundColor={colors.elevation.level3}
            foregroundColor={colors.elevation.level5}
          >
            <Rect x="000" y="0" rx="10" ry="10" width="90" height="180" />
            <Rect x="100" y="0" rx="10" ry="10" width="90" height="180" />
            <Rect x="200" y="0" rx="10" ry="10" width="90" height="180" />
            <Rect x="300" y="0" rx="10" ry="10" width="90" height="180" />
            <Rect x="400" y="0" rx="10" ry="10" width="90" height="180" />
            <Rect x="500" y="0" rx="10" ry="10" width="90" height="180" />
          </ContentLoader>
        ) : (
          characters?.map(({ node, role }) => (
            <View
              key={node.id.toString()}
              style={[ACStyles.characterCard, { borderRadius: 8, backgroundColor: colors.elevation.level3 }]}
            >
              <Image source={node.main_picture?.medium ?? ""} style={[ACStyles.image, { borderRadius: 8 }]} />

              <View style={ACStyles.nameView}>
                <Text numberOfLines={2}>
                  {node.first_name} {node.last_name}
                </Text>

                <Text variant="bodySmall" style={{ textAlign: "right", color: colors.tertiary }}>
                  {role}
                </Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const RelatedAnimeView = ({ data }: { data: RelatedAnimeEdge[] }) => {
  const { colors } = useAppTheme();

  return (
    <View style={[ACStyles.mainView, { borderRadius: 12, backgroundColor: colors.elevation.level1 }]}>
      <Text variant="titleMedium" style={ACStyles.titleText}>
        Related Anime:
      </Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={ACStyles.scrollView}>
        {/* eslint-disable-next-line @typescript-eslint/naming-convention */}
        {data.map(({ node, relation_type_formatted }) => (
          <Card
            orientation="vertical"
            key={node.id}
            animeId={node.id}
            imageSource={node.main_picture.large ?? node.main_picture.medium}
            style={{ width: 100, height: 220, backgroundColor: colors.elevation.level3, margin: 5 }}
          >
            <View style={{ flex: 1, justifyContent: "space-between", paddingHorizontal: 5, paddingBottom: 2 }}>
              <Text numberOfLines={2}>{node.title}</Text>
              <Text
                adjustsFontSizeToFit
                numberOfLines={1}
                variant="bodySmall"
                style={{ textAlign: "right", color: colors.tertiary }}
              >
                {relation_type_formatted}
              </Text>
            </View>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
};

const AnimeDetailsScreen = () => {
  const safeArea = useSafeAreaInsets();

  const { id } = useLocalSearchParams<{ id: string }>();

  const { data, isLoading, isError } = useAnimeDetails({ animeId: id });
  const characters = useAnimeCharacters({ animeId: id });

  const pictures = useMemo(
    () => mergePictureUrls(data?.main_picture, ...(data?.pictures ?? [])),
    [data?.main_picture, data?.pictures],
  );

  if (!id || isError) return router.canGoBack() ? router.back() : router.replace("/");
  if (isLoading || !data) return <LoadingScreen />;

  return (
    <>
      <Stack.Screen
        options={{
          headerRight: () => (
            <IconButton
              disabled={!id}
              icon="share-variant"
              onPress={() => Share.share({ title: data.title, message: `https://myanimelist.net/anime/${id}` })}
            />
          ),
        }}
      />

      <FAB
        disabled={!data}
        icon="playlist-edit"
        style={[styles.fab, { bottom: safeArea.bottom + 10 }]}
        onPress={() => router.push(`/anime/${data.id}/edit`)}
      />

      <ScrollView contentContainerStyle={{ gap: 15, paddingBottom: safeArea.bottom + 100 }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 15, paddingTop: 30, paddingBottom: 15, gap: 10 }}
        >
          {pictures.map((pic, idx) => (
            <Link asChild key={pic} href={{ pathname: `/anime/${id}/pics`, params: { index: `${idx}` } }}>
              <TouchableRipple borderless>
                <Image source={pic} style={styles.image} />
              </TouchableRipple>
            </Link>
          ))}
        </ScrollView>

        <Divider />

        <View style={{ gap: 5 }}>
          <Headline style={{ textAlign: "center", paddingHorizontal: 15 }}>{data.title}</Headline>
          <MainDetailsView data={data} />

          <View style={{ paddingHorizontal: 15, gap: 15 }}>
            <ProductionDetailsView studios={data.studios} source={data.source ?? "Unknown"} />
            <AlternativeTitlesView data={data.alternative_titles} />
            <AnimeCharactersView isLoading={characters.isLoading} characters={characters.data?.data} />
            {data.related_anime.length > 0 ? <RelatedAnimeView data={data.related_anime} /> : null}
          </View>
        </View>
      </ScrollView>
    </>
  );
};

const ACStyles = StyleSheet.create({
  mainView: { overflow: "hidden" },
  titleText: { paddingTop: 15, paddingHorizontal: 15 },
  scrollView: { padding: 10, paddingHorizontal: 10 },

  characterCard: { margin: 5, width: 100, height: 195 },
  image: { width: 100, aspectRatio: "4/5" },
  nameView: { height: 70, padding: 7, gap: 5, justifyContent: "space-between" },
});

const styles = StyleSheet.create({
  fab: { zIndex: 1, position: "absolute", margin: 16, right: 0 },
  image: { height: 200, aspectRatio: "4/6", borderRadius: 12 },

  titledTextView: { flex: 1, minHeight: 60, gap: 10 },
  titledText: { paddingLeft: 5 },

  productionDetailsView: { padding: 15, height: 100, flexDirection: "row" },
  alternativeTitlesView: { gap: 10, padding: 15 },
});

export default AnimeDetailsScreen;
