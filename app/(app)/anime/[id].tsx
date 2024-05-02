import { useLocalSearchParams } from "expo-router";
import { ScrollView } from "react-native";
import { Text } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function AnimeDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const safeArea = useSafeAreaInsets();

  return (
    <ScrollView style={{ paddingTop: safeArea.top }}>
      <Text>{id}</Text>
    </ScrollView>
  );
}
