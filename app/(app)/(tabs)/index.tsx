import { FlatList } from "react-native";
import { Card } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

import data from "./index.json";

import { useAppTheme } from "@/components/Material3ThemeProvider";

export default function Home() {
  const { colors } = useAppTheme();

  return (
    <SafeAreaView style={{ backgroundColor: colors.background }}>
      <FlatList
        data={data.data}
        numColumns={3}
        style={{ width: "100%" }}
        contentContainerStyle={{ alignItems: "center", gap: 20 }}
        columnWrapperStyle={{ gap: 20, width: "100%" }}
        renderItem={({ item: { node } }) => (
          <Card style={{ width: 110 }}>
            <Card.Cover source={{ uri: node.main_picture.large }} />
            <Card.Title title={node.title} />
          </Card>
        )}
        keyExtractor={(item) => item.node.id.toString()}
      />
    </SafeAreaView>
  );
}
