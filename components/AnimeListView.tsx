import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { router } from "expo-router";
import { ForwardedRef, forwardRef } from "react";
import { StyleSheet, View } from "react-native";
import { Chip, IconButton, Surface, Text, TouchableRipple } from "react-native-paper";

import { Status } from "@/api";
import { getStatusColor } from "@/lib";

type TouchableRippleProps = React.ComponentProps<typeof TouchableRipple>;

interface AnimeListViewProps extends Omit<TouchableRippleProps, "children"> {
  animeId: number;
  title: string;
  status: Status | null | undefined;
  score: number | undefined;
  meanScore: number | undefined;
  imageSrc: string | undefined;
  totalEpisodes: number | undefined;
  watchedEpisodes: number | undefined;
}

const AnimeListView = (props: AnimeListViewProps, ref: ForwardedRef<View>) => {
  const { animeId, title, status, score, meanScore, imageSrc, totalEpisodes, watchedEpisodes, style, ...otherProps } =
    props;

  const pushToDetailsPage = () => router.push(`/anime/details/${animeId}`);
  const pushToEditPage = () => router.push(`/anime/edit/${animeId}`);

  return (
    <TouchableRipple
      ref={ref}
      borderless
      onPress={pushToDetailsPage}
      onLongPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        pushToEditPage();
      }}
      style={[AnimeListViewStyles.touchable, typeof style === "function" ? null : style]}
      {...otherProps}
    >
      <Surface mode="flat" style={AnimeListViewStyles.surface}>
        <Image
          recyclingKey={`${animeId}-${title}`}
          style={AnimeListViewStyles.image}
          source={imageSrc}
          contentFit="cover"
          transition={100}
        />

        <View style={AnimeListViewStyles.contentView}>
          <Text variant="titleMedium" numberOfLines={1} ellipsizeMode="middle" style={AnimeListViewStyles.titleText}>
            {title}
          </Text>

          <View style={AnimeListViewStyles.actionView}>
            <Chip compact style={AnimeListViewStyles.actionViewChip} icon="star">
              {score ? `${meanScore || "N/A"} — ${score}` : meanScore || "N/A"}
            </Chip>

            <Chip compact style={AnimeListViewStyles.actionViewChip} icon="motion-play-outline">
              {watchedEpisodes || status === "watching"
                ? `${watchedEpisodes ?? 0}/${totalEpisodes || "??"}`
                : totalEpisodes || "N/A"}
            </Chip>

            <View style={AnimeListViewStyles.actionViewButton}>
              <IconButton
                onPress={pushToEditPage}
                mode="contained"
                icon="playlist-edit"
                iconColor="white"
                containerColor={getStatusColor(status)}
              />
            </View>
          </View>
        </View>
      </Surface>
    </TouchableRipple>
  );
};

const AnimeListViewStyles = StyleSheet.create({
  touchable: { height: 100, borderRadius: 10 },
  surface: { flexDirection: "row" },
  image: { height: 100, width: 100 },
  contentView: { paddingTop: 10, paddingLeft: 5, flex: 1, justifyContent: "space-around" },
  titleText: { paddingHorizontal: 10 },
  actionView: { paddingRight: 5, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  actionViewChip: { flex: 1, backgroundColor: "transparent" },
  actionViewButton: { flex: 1, flexDirection: "row", justifyContent: "flex-end", alignItems: "center" },
});

const Component = forwardRef(AnimeListView);

export default Component;