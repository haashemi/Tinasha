import type { ViewProps } from "react-native";
import { View } from "react-native";
import { ActivityIndicator } from "react-native-paper";

const LoadingScreen = ({ style, ...props }: ViewProps) => {
  return (
    <View style={[{ flex: 1, justifyContent: "center", alignItems: "center" }, style]} {...props}>
      <ActivityIndicator size="large" />
    </View>
  );
};

export default LoadingScreen;
