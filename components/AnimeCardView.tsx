import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { ForwardedRef, forwardRef } from "react";
import { StyleSheet, View } from "react-native";
import { Icon, Text, TouchableRipple } from "react-native-paper";

import Image from "./Image";
import { useAppTheme } from "./providers";

import { WatchingStatus } from "@/api";
import { getMediaType } from "@/lib";

type TouchableRippleProps = React.ComponentProps<typeof TouchableRipple>;

interface AnimeCardViewProps extends Omit<TouchableRippleProps, "children"> {
  animeId: number;
  title: string;
  status: WatchingStatus | null | undefined;
  meanScore: number | null | undefined;
  imageSrc: string | undefined;
  mediaType: string | undefined;
}

const AnimeCardView = (props: AnimeCardViewProps, ref: ForwardedRef<View>) => {
  const { animeId, title, status, meanScore, imageSrc, mediaType, style, ...otherProps } = props;

  const { colors, roundness, fonts } = useAppTheme();

  return (
    <TouchableRipple
      ref={ref}
      borderless
      onPress={() => router.push(`/anime/${animeId}`)}
      onLongPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        router.push(`/anime/${animeId}/edit`);
      }}
      style={[
        AnimeCardViewStyles.touchable,
        { borderRadius: roundness * 2 },
        typeof style === "function" ? null : style,
      ]}
      {...otherProps}
    >
      <View style={[{ backgroundColor: colors.elevation.level1 }, AnimeCardViewStyles.surface]}>
        <Image recyclingKey={`${animeId}-${title}`} style={AnimeCardViewStyles.image} source={imageSrc} />

        <View style={AnimeCardViewStyles.contentView}>
          <Text variant="titleSmall" numberOfLines={2} ellipsizeMode="tail" style={AnimeCardViewStyles.titleText}>
            {title}
          </Text>

          <View style={AnimeCardViewStyles.statusView}>
            <Icon source="star" color={colors.onSecondaryContainer} size={18} />

            <View style={[AnimeCardViewStyles.statusView2]}>
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
        </View>
      </View>
    </TouchableRipple>
  );
};

const AnimeCardViewStyles = StyleSheet.create({
  touchable: { height: 260, flex: 1 },
  surface: { flex: 1 },
  image: { width: "100%", aspectRatio: "4/6" },
  contentView: { paddingTop: 0, paddingLeft: 5, flex: 1, justifyContent: "space-around" },
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

const Component = forwardRef(AnimeCardView);

export default Component;
