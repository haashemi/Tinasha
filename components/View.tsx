import { Theme } from "@react-navigation/native";
import { View as NativeView } from "react-native";
import { withTheme } from "react-native-paper";

export interface ThemedViewProps extends React.ComponentProps<typeof NativeView> {
  theme: Theme;
}

export const ThemedView = ({ theme, style, ...props }: ThemedViewProps) => (
  <NativeView style={[{ backgroundColor: theme.colors.background, height: "100%" }, style]} {...props} />
);

export const View = withTheme(ThemedView);
