import { Link, usePathname } from "expo-router";
import { View } from "react-native";
import { Button, Text } from "react-native-paper";

export default function NotFoundScreen() {
  const path = usePathname();

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text variant="titleLarge">This screen doesn't exist.</Text>
      <Text variant="bodySmall">path: {path}</Text>
      <Link asChild href="/">
        <Button mode="text">Go to home screen!</Button>
      </Link>
    </View>
  );
}
