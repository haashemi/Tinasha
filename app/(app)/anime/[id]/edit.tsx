import { router, Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, KeyboardAvoidingView, ScrollView, View } from "react-native";
import { Button, Chip, Divider, IconButton, SegmentedButtons, Text, TextInput } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import type { AnimeDetails, WatchingStatus } from "@/api";
import { useAnimeDetails, useDeleteMyAnimeListItem, useUpdateMyAnimeListStatus } from "@/api";
import { Image, useAppTheme } from "@/components";
import { getStatusColor } from "@/lib";

const AnimeDetailsView = ({ data }: { data?: AnimeDetails }) => {
  const { roundness } = useAppTheme();

  return (
    <View style={{ height: 200, marginVertical: 20, flexDirection: "row", alignItems: "center", gap: 15 }}>
      <Image
        source={data?.main_picture.large ?? data?.main_picture.medium}
        style={{ height: 200, aspectRatio: "4/6", borderRadius: roundness * 3 }}
      />

      <View style={{ flex: 1, flexGrow: 1, height: "100%", paddingVertical: 20, justifyContent: "space-between" }}>
        <Text variant="titleMedium">{data?.title}</Text>
        <Chip style={{ backgroundColor: "transparent" }} icon="star">
          {data?.mean ?? "N/A"}
        </Chip>
      </View>
    </View>
  );
};

const AnimeEditScreen = () => {
  const [status, setStatus] = useState<WatchingStatus>("watching");
  const [episode, setEpisode] = useState(0);
  const [score, setScore] = useState(0);

  const { id } = useLocalSearchParams<{ id: string }>();
  const { bottom } = useSafeAreaInsets();
  const { colors, dark } = useAppTheme();

  const detailAnime = useAnimeDetails({ animeId: id });
  const deleteAnime = useDeleteMyAnimeListItem();
  const updateAnime = useUpdateMyAnimeListStatus();

  const data = detailAnime.data;
  const isLoading = updateAnime.isPending || deleteAnime.isPending || detailAnime.isFetching;

  const updateEpisode = (ep: number) => {
    if (!data) return;

    if (ep < 0) return setEpisode(0);
    else if (ep > data.num_episodes) return setEpisode(data.num_episodes);
    else setEpisode(ep);
  };

  const updateScore = (newScore: number) => {
    if (newScore < 0) return setScore(0);
    else if (newScore > 10) return setScore(10);
    else setScore(newScore);
  };

  const onDeleteAnime = () => {
    if (!data) return;

    Alert.alert(
      "Are you sure?",
      `You're going to remove ${data.title} from your list.`,
      [
        { text: "No" },
        {
          text: "Yes",
          onPress: () => {
            deleteAnime.mutate({ animeId: data.id });
            router.back();
          },
        },
      ],
      {
        cancelable: true,
        userInterfaceStyle: dark ? "dark" : "light",
      },
    );
  };

  const onUpdateAnime = async () => {
    if (!data) return;

    await updateAnime.mutateAsync({ animeId: data.id, body: { status, num_watched_episodes: episode, score } });
    router.back();
  };

  useEffect(() => {
    if (!data?.my_list_status) return;

    setStatus(data.my_list_status.status);
    setEpisode(data.my_list_status.num_episodes_watched);
    setScore(data.my_list_status.score);
  }, [data]);

  return (
    <>
      <Stack.Screen
        options={{
          title: "",
          headerRight: () => (
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
              <Button disabled={isLoading} mode="text" textColor={colors.error} onPress={onDeleteAnime}>
                Delete
              </Button>
              <Button disabled={isLoading} mode="outlined" textColor={colors.primary} onPress={onUpdateAnime}>
                Save
              </Button>
            </View>
          ),
        }}
      />

      <KeyboardAvoidingView
        style={{ flex: 1, flexDirection: "column", justifyContent: "center" }}
        behavior="padding"
        enabled
        keyboardVerticalOffset={100}
      >
        <ScrollView contentContainerStyle={{ paddingHorizontal: 20, gap: 20, paddingBottom: bottom + 80 }}>
          <AnimeDetailsView data={data} />
          <Divider />

          <ScrollView showsHorizontalScrollIndicator={false} horizontal contentContainerStyle={{ gap: 5 }}>
            <SegmentedButtons
              value={status}
              onValueChange={(v) => setStatus(v as WatchingStatus)}
              theme={{ colors: { secondaryContainer: colors.elevation.level5 } }}
              buttons={[
                { checkedColor: getStatusColor("watching"), value: "watching", label: "Watching" },
                { checkedColor: getStatusColor("completed"), value: "completed", label: "Completed" },
                { checkedColor: getStatusColor("on_hold"), value: "on_hold", label: "On Hold" },
                { checkedColor: getStatusColor("dropped"), value: "dropped", label: "Dropped" },
                { checkedColor: "#6b7280", value: "plan_to_watch", label: "Plan to Watch" },
              ]}
            />
          </ScrollView>

          <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 20, margin: 10 }}>
            <IconButton
              disabled={episode === 0}
              mode="outlined"
              icon="minus"
              onPress={() => updateEpisode(episode - 1)}
            />
            <TextInput
              disabled={isLoading}
              mode="outlined"
              label="Episodes"
              keyboardType="numeric"
              value={episode.toString()}
              onChangeText={(v) => updateEpisode(v ? parseInt(v, 10) : 0)}
              style={{ textAlign: "center" }}
              right={<TextInput.Affix text={`/${data?.num_episodes ?? "??"}`} />}
            />
            <IconButton
              disabled={data?.num_episodes ? episode === data.num_episodes : false}
              mode="outlined"
              icon="plus"
              onPress={() => updateEpisode(episode + 1)}
            />
          </View>

          <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 20, margin: 10 }}>
            <IconButton disabled={score === 0} mode="outlined" icon="minus" onPress={() => updateScore(score - 1)} />
            <TextInput
              disabled={isLoading}
              mode="outlined"
              label="Score"
              keyboardType="numeric"
              value={score.toString()}
              onChangeText={(v) => updateScore(v ? parseInt(v, 10) : 0)}
              style={{ textAlign: "center" }}
              right={<TextInput.Affix text="/10" />}
            />
            <IconButton disabled={score === 10} mode="outlined" icon="plus" onPress={() => updateScore(score + 1)} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};

export default AnimeEditScreen;
