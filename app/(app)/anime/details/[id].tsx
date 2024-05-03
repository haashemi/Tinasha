import { Stack, useLocalSearchParams } from "expo-router";
import { View } from "react-native";
import { Text } from "react-native-paper";

export default function AnimeDetails() {
  const params = useLocalSearchParams<{ id: string }>();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Stack.Screen
        options={{
          title: `${params.id} details.`,
        }}
      />

      <Text>Anime Details</Text>
      <Text>Not Implemented</Text>
    </View>
  );
}
