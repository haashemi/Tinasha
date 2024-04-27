import { FlatList, View } from "react-native";
import { Card, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

import { getSeason, useSessionalAnime } from "@/api";

export default function Home() {
  const date = new Date();
  const { data, isLoading, isError } = useSessionalAnime({
    year: date.getFullYear(),
    season: getSeason(date.getMonth()),
  });

  return (
    <SafeAreaView style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <View style={{ alignItems: "center", justifyContent: "center", height: 250 }}>
        {isLoading ? (
          <Text style={{ marginVertical: 20 }} variant="headlineLarge">
            Loading...
          </Text>
        ) : isError ? (
          <Text style={{ marginVertical: 20 }} variant="headlineLarge">
            Failed!
          </Text>
        ) : (
          <FlatList
            data={data.data}
            horizontal
            snapToAlignment="start"
            decelerationRate="fast"
            snapToInterval={120}
            contentContainerStyle={{ gap: 10, marginHorizontal: 20 }}
            renderItem={({ item: { node } }) => (
              <Card style={{ width: 110, height: 250 }}>
                <Card.Cover source={{ uri: node.main_picture.large }} />
                <Card.Title title={node.title} />
              </Card>
            )}
            keyExtractor={(item) => item.node.id.toString()}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
