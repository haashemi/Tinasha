import { View, ViewProps } from "react-native";
import { ActivityIndicator } from "react-native-paper";

const LoadingView = ({ style, ...props }: ViewProps) => {
  return (
    <View style={[style, { flex: 1, justifyContent: "center", alignItems: "center" }]} {...props}>
      <ActivityIndicator size="large" />
    </View>
  );
};

export default LoadingView;
