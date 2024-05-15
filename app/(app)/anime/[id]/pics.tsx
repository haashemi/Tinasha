import { Redirect, router, Stack, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import type { RenderItemInfo } from "react-native-awesome-gallery";
import Gallery from "react-native-awesome-gallery";
import { Text } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAnimeDetails } from "@/api";
import { Image, LoadingScreen } from "@/components";

const PicsScreen = () => {
  const { bottom } = useSafeAreaInsets();
  const { id, index } = useLocalSearchParams<{ id: string; index: string }>();
  const [currentIndex, setCurrentIndex] = useState(parseInt(index ?? "0", 10));
  const { data, isLoading, isError } = useAnimeDetails({ animeId: id });

  const pictures = useMemo(
    () => [
      ...new Set([
        data?.main_picture.large ?? data?.main_picture.medium,
        ...(data?.pictures.map((v) => v.large ?? v.medium) ?? []),
      ]),
    ],
    [data?.main_picture.large, data?.main_picture.medium, data?.pictures],
  );

  const renderItem = ({ item, setImageDimensions }: RenderItemInfo<string | undefined>) => {
    return (
      <Image
        source={item}
        style={StyleSheet.absoluteFillObject}
        contentFit="contain"
        onLoad={(e) => {
          const { width, height } = e.source;
          setImageDimensions({ width, height });
        }}
      />
    );
  };

  if (isError || !id) {
    return <Redirect href={id ? `/anime/${id}` : "/"} />;
  } else if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <Stack.Screen
        options={{ headerShown: false, headerStyle: { backgroundColor: "#000000C0" }, headerShadowVisible: false }}
      />

      <View style={{ flex: 1, paddingBottom: bottom + 20, backgroundColor: "#000000C0" }}>
        <Gallery
          data={pictures}
          initialIndex={currentIndex}
          onIndexChange={setCurrentIndex}
          renderItem={renderItem}
          onSwipeToClose={() => (router.canGoBack() ? router.back() : router.push(`/anime/${id}`))}
          style={{ backgroundColor: "transparent" }}
        />

        <Text variant="titleLarge" style={{ textAlign: "center", color: "white" }}>
          {currentIndex + 1} / {pictures.length}
        </Text>
      </View>
    </>
  );
};

export default PicsScreen;
