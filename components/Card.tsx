import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import type { ForwardedRef } from "react";
import type { ViewProps } from "react-native";
import { StyleSheet, View } from "react-native";
import { Chip, Icon, IconButton, Text, TouchableRipple } from "react-native-paper";

import type { WatchingStatus } from "@/api";
import { useUpdateMyAnimeListStatus } from "@/api";
import { useAppTheme } from "@/context";
import { getMediaType, getStatusColor } from "@/lib";

import Image from "./Image";

interface CardProps extends ViewProps {
  animeId: number | string;
  orientation?: "horizontal" | "vertical";
  imageSource: string;
  children: React.ReactNode;
}

export const Card = (props: CardProps, ref: ForwardedRef<View>) => {
  const { animeId, orientation = "horizontal", imageSource, children, style, ...otherProps } = props;
  const theme = useAppTheme();

  return (
    <TouchableRipple
      ref={ref}
      borderless
      onPress={() => router.push(`/anime/${animeId}`)}
      onLongPress={() => {
        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        router.push(`/ownlist/anime/${animeId}/edit`);
      }}
      style={[
        {
          height: orientation === "horizontal" ? 140 : 260,
          flex: 1,
          borderRadius: 12,
          backgroundColor: theme.colors.elevation.level1,
        },
        style,
      ]}
      {...otherProps}
    >
      <View style={{ flex: 1, flexDirection: orientation === "horizontal" ? "row" : "column" }}>
        <Image
          recyclingKey={imageSource}
          style={{
            height: orientation === "horizontal" ? "100%" : undefined,
            width: orientation === "vertical" ? "100%" : undefined,
            aspectRatio: "4/6",
            borderRadius: 12,
          }}
          source={imageSource}
        />

        <View
          style={{
            paddingTop: orientation === "horizontal" ? 20 : 8,
            paddingBottom: 5,
            paddingLeft: 5,
            flex: 1,
            justifyContent: "space-between",
          }}
        >
          {children}
        </View>
      </View>
    </TouchableRipple>
  );
};

interface CardSummaryProps {
  title: string;
  meanScore: number | null | undefined;
  mediaType: string | undefined;
}

export const CardSummary = ({ title, meanScore, mediaType }: CardSummaryProps) => {
  const { colors, fonts } = useAppTheme();

  return (
    <>
      <Text variant="titleSmall" numberOfLines={2} ellipsizeMode="tail" style={stylesCS.titleText}>
        {title}
      </Text>

      <View style={stylesCS.statusView}>
        <Icon source="star" color={colors.onSecondaryContainer} size={18} />

        <View style={[stylesCS.statusView2]}>
          <Text
            numberOfLines={1}
            adjustsFontSizeToFit
            style={[{ color: colors.onSecondaryContainer }, fonts.labelLarge]}
          >
            {meanScore ?? "N/A"}
          </Text>

          {mediaType ? (
            <Text
              numberOfLines={1}
              adjustsFontSizeToFit
              style={[{ color: colors.onSecondaryContainer }, fonts.labelLarge]}
            >
              {getMediaType(mediaType)}
            </Text>
          ) : null}
        </View>
      </View>
    </>
  );
};

interface CardDetailsProps {
  animeId: number;
  title: string;
  status: WatchingStatus | null | undefined;
  score: number | undefined;
  meanScore: number | null | undefined;
  totalEpisodes: number | undefined;
  watchedEpisodes: number | undefined;
}

export const CardDetails = ({
  animeId,
  title,
  status,
  meanScore,
  score,
  watchedEpisodes,
  totalEpisodes,
}: CardDetailsProps) => {
  const theme = useAppTheme();
  const { mutate, isPending } = useUpdateMyAnimeListStatus();

  return (
    <>
      <Text variant="titleMedium" numberOfLines={1} ellipsizeMode="middle" style={stylesCD.titleText}>
        {title}
      </Text>

      <View style={stylesCD.actionView}>
        <Chip compact style={stylesCD.actionViewChip} icon="star">
          {score ? `${meanScore ?? "N/A"} — ${score}` : meanScore ?? "N/A"}
        </Chip>

        <Chip compact style={stylesCD.actionViewChip} icon="motion-play-outline">
          {watchedEpisodes ?? status === "watching"
            ? `${watchedEpisodes ?? 0}/${totalEpisodes && totalEpisodes > 0 ? totalEpisodes : "??"}`
            : totalEpisodes && totalEpisodes > 0
              ? totalEpisodes
              : "N/A"}
        </Chip>

        <View style={stylesCD.actionViewButton}>
          {status === "watching" && (
            <IconButton
              disabled={isPending}
              loading={isPending}
              onPress={() => {
                if (!watchedEpisodes) return;

                void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                mutate({ animeId, body: { num_watched_episodes: watchedEpisodes + 1 } });
              }}
              onLongPress={() => {
                if (!watchedEpisodes) return;

                void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                mutate({ animeId, body: { num_watched_episodes: watchedEpisodes - 1 } });
              }}
              mode="outlined"
              icon="plus-minus"
              iconColor={theme.colors.onSurface}
              containerColor="transparent"
            />
          )}
          <IconButton
            onPress={() => router.push(`/ownlist/anime/${animeId}/edit`)}
            mode="contained"
            icon="playlist-edit"
            iconColor="white"
            containerColor={getStatusColor(status)}
          />
        </View>
      </View>
    </>
  );
};

const stylesCS = StyleSheet.create({
  titleText: { paddingHorizontal: 5 },
  statusView: { flexDirection: "row", alignItems: "center", paddingHorizontal: 5, paddingBottom: 5, gap: 5 },
  statusView2: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingRight: 5,
    alignItems: "center",
  },
});

const stylesCD = StyleSheet.create({
  touchable: { height: 100 },
  surface: { flexDirection: "row" },
  image: { height: 100, width: 100 },
  contentView: { paddingTop: 10, paddingLeft: 5, flex: 1, justifyContent: "space-around" },
  titleText: { paddingHorizontal: 10 },
  actionView: { paddingRight: 5, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  actionViewChip: { flex: 1, backgroundColor: "transparent" },
  actionViewButton: { flex: 1, flexDirection: "row", justifyContent: "flex-end", alignItems: "center" },
});
