import { Image } from "expo-image";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { ScrollView, View } from "react-native";
import { Chip, FAB, Icon, Text } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAnimeCharacters, useAnimeDetails } from "@/api";
import { useAppTheme } from "@/components";
import { getAiringStatus, getMediaType, getNormalizedSeason, getSource } from "@/lib";

const Thing = ({ title, text, center }: { title: string; text: any; center?: boolean }) => (
  <View style={{ flex: 1, justifyContent: "space-around", alignItems: center ? "center" : "baseline", height: 60 }}>
    <Text variant="bodyMedium">{title}:</Text>
    <Text variant="titleMedium" style={{ paddingLeft: 5 }}>
      {text}
    </Text>
  </View>
);

const Characters = ({ animeId }: { animeId: string }) => {
  const theme = useAppTheme();
  const { data } = useAnimeCharacters({ animeId });

  return (
    <View
      style={{
        overflow: "hidden",
        borderRadius: theme.roundness * 3,
        backgroundColor: theme.colors.elevation.level1,
      }}
    >
      <Text variant="titleMedium" style={{ paddingTop: 8, paddingHorizontal: 15 }}>
        Characters:
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ padding: 5, paddingHorizontal: 10 }}
      >
        {data?.data.map((character) => (
          <View
            key={character.node.id.toString()}
            style={{
              margin: 5,
              width: 90,
              height: 180,
              borderRadius: theme.roundness * 2.5,
              backgroundColor: theme.colors.elevation.level3,
            }}
          >
            <Image
              source={character.node.main_picture.medium}
              style={{ width: 90, aspectRatio: "4/5", borderRadius: theme.roundness * 2.5 }}
              contentFit="cover"
              transition={100}
            />

            <View style={{ height: 70, padding: 7, gap: 5, justifyContent: "space-between" }}>
              <Text numberOfLines={2}>
                {character.node.first_name} {character.node.last_name}
              </Text>
              <Text variant="bodySmall" style={{ textAlign: "right", color: theme.colors.tertiary }}>
                {character.role}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default function AnimeDetails() {
  const theme = useAppTheme();
  const router = useRouter();
  const safeArea = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data } = useAnimeDetails({ animeId: id });

  return (
    <>
      <Stack.Screen options={{ headerTitle: data?.title }} />

      <FAB
        icon="playlist-edit"
        style={{ zIndex: 1, position: "absolute", margin: 16, right: 0, bottom: 10 }}
        onPress={() => router.push(`/anime/edit/${id}`)}
      />

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, gap: 15, paddingBottom: safeArea.bottom + 80 }}>
        <View style={{ paddingVertical: 25, flexDirection: "row", alignItems: "center", gap: 15 }}>
          <Image
            transition={200}
            source={data?.main_picture.large || data?.main_picture.medium}
            style={{ height: 200, aspectRatio: "4/6", borderRadius: theme.roundness * 3 }}
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
              <Icon source="drama-masks" size={20} color={theme.colors.primary} />
              <Text
                numberOfLines={3}
                adjustsFontSizeToFit
                style={{ ...theme.fonts.labelLarge, color: theme.colors.onPrimaryContainer }}
              >
                {data?.genres.map((v) => v.name).join(", ") || "N/A"}
              </Text>
            </View>
          </View>
        </View>

        <View
          style={{
            padding: 15,
            flexDirection: "row",
            borderRadius: theme.roundness * 3,
            backgroundColor: theme.colors.elevation.level1,
          }}
        >
          <Thing center title="Studios" text={data?.studios.map((v) => v.name).join(", ") || "N/A"} />
          <Thing center title="Source" text={getSource(data?.source)} />
        </View>

        <View
          style={{
            gap: 15,
            padding: 15,
            borderRadius: theme.roundness * 3,
            backgroundColor: theme.colors.elevation.level1,
          }}
        >
          <Thing title="Enlgish" text={data?.alternative_titles.en || "N/A"} />

          <Thing title="Native" text={data?.alternative_titles.ja || "N/A"} />

          {data?.alternative_titles.synonyms && data?.alternative_titles.synonyms.length > 0 ? (
            <Thing title="Synonyms" text={data?.alternative_titles.synonyms.join(", ")} />
          ) : null}
        </View>

        <Characters animeId={id} />
      </ScrollView>
    </>
  );
}
