import { Redirect, useLocalSearchParams } from "expo-router";

const AnimeDetailsRedirect = () => {
  const { id } = useLocalSearchParams<{ id: string }>();

  return <Redirect href={id ? `/anime/${id}` : "/"} />;
};

export default AnimeDetailsRedirect;
