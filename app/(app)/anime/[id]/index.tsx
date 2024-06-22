import { Link, router, Stack, useLocalSearchParams } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { Fragment, useMemo } from "react";
import ContentLoader, { Rect } from "react-content-loader/native";
import { ScrollView, Share, StyleSheet, View } from "react-native";
import { Chip, Divider, FAB, IconButton, Text, TouchableRipple } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import type {
  AlternativeTitles as AlternativeTitlesData,
  AnimeNode,
  AnimeStudio,
  CharacterNode,
  Picture,
  RelatedAnimeEdge,
} from "@/api";
import { useAnimeCharacters, useAnimeDetails } from "@/api";
import { Card, Image, LoadingScreen } from "@/components";
import { useAppTheme } from "@/context";
import { getAiringStatus, getMediaType, getNormalizedSeason, getSource, mergePictureUrls } from "@/lib";

interface AnimeCharactersViewProps {
  isLoading: boolean;
  characters?: { node: CharacterNode; role: string }[];
}

const Pictures = ({ id, mainPicture, pictures }: { id: number; mainPicture: Picture; pictures: Picture[] }) => {
  const sortedPictures = useMemo(() => mergePictureUrls(mainPicture, ...pictures), [mainPicture, pictures]);

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pictureView}>
      {sortedPictures.map((pic, idx) => (
        <Link asChild key={pic} href={{ pathname: `/anime/${id}/pics`, params: { index: `${idx}` } }}>
          <TouchableRipple borderless>
            <Image source={pic} style={styles.pictureViewImage} />
          </TouchableRipple>
        </Link>
      ))}
    </ScrollView>
  );
};

const MainDetails = ({ data }: { data: AnimeNode }) => {
  const { colors } = useAppTheme();

  const rows = useMemo(
    () =>
      [
        {
          id: "1",
          columns: [
            { icon: "fire", text: data.popularity },
            { icon: "star", text: data.mean ?? "N/A" },
          ],
        },
        {
          id: "2",
          columns: [
            {
              icon: "television-classic",
              text:
                data.average_episode_duration && data.average_episode_duration > 0
                  ? `${getMediaType(data.media_type)} - ${(data.average_episode_duration / 60).toFixed(0)}m`
                  : getMediaType(data.media_type),
            },
            { icon: "movie-roll", text: data.num_episodes ? `${data.num_episodes} EP` : "?? EP" },
          ],
        },
        {
          id: "3",
          columns: [
            {
              icon: "calendar-month",
              text: `${getNormalizedSeason(data.start_season?.season)} ${data.start_season?.year ?? "0000"}`,
            },
            { icon: "satellite-variant", text: getAiringStatus(data.status) },
          ],
        },
      ] as const,
    [data],
  );

  return (
    <View style={styles.mainDetailsView}>
      <Divider />
      {rows.map((row, rIndex) => (
        <Fragment key={row.id}>
          {rIndex > 0 ? <Divider /> : null}
          <View style={styles.mainDetailsRowView}>
            {row.columns.map((column, cIndex) => (
              <Fragment key={column.icon}>
                {cIndex > 0 ? <Divider style={styles.mainDetailsColumnDivider} /> : null}
                <Chip style={styles.mainDetailsChipView} compact icon={column.icon}>
                  {column.text}
                </Chip>
              </Fragment>
            ))}
          </View>
        </Fragment>
      ))}
      <Divider />

      <View style={styles.mainDetailsGenresView}>
        {data.genres.map((v) => (
          <Chip
            compact
            mode="flat"
            onPress={() => WebBrowser.openBrowserAsync(`https://myanimelist.net/anime/genre/${v.id}`)}
            style={[styles.mainDetailsGenreChip, { borderColor: colors.surfaceContainerHighest }]}
            key={v.id.toString()}
          >
            {v.name}
          </Chip>
        ))}
      </View>
    </View>
  );
};

const ProductionDetails = ({ studios, source }: { studios: AnimeStudio[]; source: string }) => {
  const { colors } = useAppTheme();

  return (
    <View style={[styles.productionDetailsView, { backgroundColor: colors.elevation.level1 }]}>
      <View style={styles.productionDetailsTextView}>
        <Text variant="bodyMedium">Studios:</Text>
        <Text variant="titleMedium" numberOfLines={2}>
          {studios.map((v) => v.name).join(", ") || "N/A"}
        </Text>
      </View>

      <View style={styles.productionDetailsTextView}>
        <Text variant="bodyMedium">Source:</Text>
        <Text variant="titleMedium" numberOfLines={1}>
          {getSource(source)}
        </Text>
      </View>
    </View>
  );
};

const AlternativeTitles = ({ data }: { data: AlternativeTitlesData }) => {
  const { colors } = useAppTheme();

  return (
    <View style={[styles.alternativeTitlesView, { backgroundColor: colors.elevation.level1 }]}>
      <View style={styles.alternativeTitlesTextView}>
        <Text variant="bodyMedium">English:</Text>
        <Text variant="titleMedium" style={styles.alternativeTitlesText} numberOfLines={3}>
          {data.en ?? "Unknown"}
        </Text>
      </View>

      <View style={styles.alternativeTitlesTextView}>
        <Text variant="bodyMedium">Native:</Text>
        <Text variant="titleMedium" style={styles.alternativeTitlesText} numberOfLines={3}>
          {data.ja ?? "Unknown"}
        </Text>
      </View>

      {data.synonyms && data.synonyms.length > 0 ? (
        <View style={styles.alternativeTitlesTextView}>
          <Text variant="bodyMedium">Synonyms:</Text>
          <Text variant="titleMedium" style={styles.alternativeTitlesText}>
            {data.synonyms.join("\n")}
          </Text>
        </View>
      ) : null}
    </View>
  );
};

// TODO: Add a placeholder for empty images.
const AnimeCharacters = ({ isLoading, characters }: AnimeCharactersViewProps) => {
  const { colors } = useAppTheme();

  return (
    <View style={[styles.animeCharactersView, { backgroundColor: colors.elevation.level1 }]}>
      <Text variant="titleMedium" style={styles.animeCharactersTitle}>
        Characters:
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.animeCharactersScrollView}
      >
        {isLoading ? (
          <ContentLoader
            width={590}
            height={180}
            style={{ margin: 5 }}
            viewBox="0 0 590 220"
            backgroundColor={colors.elevation.level3}
            foregroundColor={colors.elevation.level5}
          >
            <Rect x="000" y="0" rx="10" ry="10" width="90" height="220" />
            <Rect x="100" y="0" rx="10" ry="10" width="90" height="220" />
            <Rect x="200" y="0" rx="10" ry="10" width="90" height="220" />
            <Rect x="300" y="0" rx="10" ry="10" width="90" height="220" />
            <Rect x="400" y="0" rx="10" ry="10" width="90" height="220" />
            <Rect x="500" y="0" rx="10" ry="10" width="90" height="220" />
          </ContentLoader>
        ) : (
          characters?.map(({ node, role }) => (
            <View
              key={node.id.toString()}
              style={[styles.animeCharactersCard, { borderRadius: 8, backgroundColor: colors.elevation.level3 }]}
            >
              <Image source={node.main_picture?.medium ?? ""} style={styles.animeCharactersImage} />

              <View style={styles.animeCharactersCardView}>
                <Text numberOfLines={2}>
                  {node.first_name} {node.last_name}
                </Text>

                <Text variant="bodySmall" style={[styles.animeCharactersCardText, { color: colors.tertiary }]}>
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

const RelatedAnime = ({ data }: { data: RelatedAnimeEdge[] }) => {
  const { colors } = useAppTheme();

  return (
    <View style={[styles.relatedAnimeView, { backgroundColor: colors.elevation.level1 }]}>
      <Text variant="titleMedium" style={styles.relatedAnimeTitle}>
        Related Anime:
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.relatedAnimeScrollView}
      >
        {/* eslint-disable-next-line @typescript-eslint/naming-convention */}
        {data.map(({ node, relation_type_formatted }) => (
          <Card
            orientation="vertical"
            key={node.id}
            animeId={node.id}
            imageSource={node.main_picture.large ?? node.main_picture.medium}
            style={[styles.relatedAnimeCard, { backgroundColor: colors.elevation.level3 }]}
          >
            <View style={styles.relatedAnimeCardView}>
              <Text numberOfLines={2}>{node.title}</Text>
              <Text
                adjustsFontSizeToFit
                numberOfLines={1}
                variant="bodySmall"
                style={[styles.relatedAnimeCardText, { color: colors.tertiary }]}
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
        onPress={() => router.push(`/ownlist/anime/${data.id}/edit`)}
      />

      <ScrollView contentContainerStyle={{ gap: 15, paddingBottom: safeArea.bottom + 100 }}>
        <Pictures id={data.id} mainPicture={data.main_picture} pictures={data.pictures} />

        <Divider />

        <Text variant="headlineSmall" style={{ textAlign: "center", paddingHorizontal: 15 }}>
          {data.title}
        </Text>

        <MainDetails data={data} />

        <View style={{ paddingHorizontal: 15, gap: 15 }}>
          <ProductionDetails studios={data.studios} source={data.source ?? "Unknown"} />
          <AlternativeTitles data={data.alternative_titles} />
          <AnimeCharacters isLoading={characters.isLoading} characters={characters.data?.data} />
          {data.related_anime.length > 0 ? <RelatedAnime data={data.related_anime} /> : null}
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  fab: { zIndex: 1, position: "absolute", margin: 16, right: 0 },

  pictureView: { paddingHorizontal: 15, paddingTop: 30, paddingBottom: 15, gap: 10 },
  pictureViewImage: { height: 200, aspectRatio: "4/6", borderRadius: 12 },

  mainDetailsView: { flex: 1, flexGrow: 1, height: "100%" },
  mainDetailsRowView: { flexWrap: "wrap", paddingHorizontal: 15, gap: 5, flexDirection: "row" },
  mainDetailsColumnDivider: { width: 1, height: "100%" },
  mainDetailsChipView: { flex: 1, paddingVertical: 10, backgroundColor: "transparent" },
  mainDetailsGenresView: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 5,
    paddingTop: 15,
    paddingBottom: 5,
  },
  mainDetailsGenreChip: { borderWidth: 1, backgroundColor: "transparent" },

  productionDetailsView: { flexDirection: "row", padding: 15, height: 100, borderRadius: 12 },
  productionDetailsTextView: { flex: 1, minHeight: 60, gap: 10, justifyContent: "center", alignItems: "center" },

  alternativeTitlesView: { gap: 10, padding: 15, borderRadius: 12 },
  alternativeTitlesTextView: { flex: 1, minHeight: 60, gap: 10 },
  alternativeTitlesText: { paddingLeft: 5 },

  animeCharactersView: { overflow: "hidden", borderRadius: 12 },
  animeCharactersTitle: { paddingTop: 15, paddingHorizontal: 15 },
  animeCharactersScrollView: { padding: 10, paddingHorizontal: 10 },
  animeCharactersCard: { width: 100, height: 220, margin: 5 },
  animeCharactersImage: { width: 100, aspectRatio: "4/6", borderRadius: 8 },
  animeCharactersCardView: { flex: 1, justifyContent: "space-between", paddingHorizontal: 5, paddingVertical: 5 },
  animeCharactersCardText: { textAlign: "right" },

  relatedAnimeView: { overflow: "hidden", borderRadius: 12 },
  relatedAnimeTitle: { paddingTop: 15, paddingHorizontal: 15 },
  relatedAnimeScrollView: { padding: 10, paddingHorizontal: 10 },
  relatedAnimeCard: { width: 100, height: 220, margin: 5 },
  relatedAnimeCardView: { flex: 1, justifyContent: "space-between", paddingHorizontal: 5, paddingBottom: 2 },
  relatedAnimeCardText: { textAlign: "right" },
});

export default AnimeDetailsScreen;
