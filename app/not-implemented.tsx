import { Link } from "expo-router";
import { View } from "react-native";
import { Button, Text } from "react-native-paper";

const NotImplementedScreen = () => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>NOT IMPLEMENTED</Text>
      <Link asChild href="/">
        <Button>Back to Home</Button>
      </Link>
    </View>
  );
};

export default NotImplementedScreen;
