import { Redirect, useLocalSearchParams } from "expo-router";

export default function AnimeDetailsRedirect() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return <Redirect href={`/anime/${id}`} />;
}
