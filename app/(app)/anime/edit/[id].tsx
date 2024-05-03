import { Stack, useLocalSearchParams } from "expo-router";
import { View } from "react-native";
import { Text } from "react-native-paper";

export default function AnimeEdit() {
  const params = useLocalSearchParams<{ id: string }>();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Stack.Screen
        options={{
          title: `Editing ${params.id}`,
        }}
      />

      <Text>Anime Edit</Text>
      <Text>Not Implemented</Text>
    </View>
  );
}
