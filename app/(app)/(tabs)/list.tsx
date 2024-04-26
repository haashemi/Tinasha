import { ScrollView } from "react-native";
import { Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAppTheme } from "@/components/Material3ThemeProvider";

export default function List() {
  const { colors } = useAppTheme();

  return (
    <SafeAreaView style={{ backgroundColor: colors.background, height: "100%" }}>
      <ScrollView>
        <Text variant="headlineLarge">List</Text>
      </ScrollView>
    </SafeAreaView>
  );
}
