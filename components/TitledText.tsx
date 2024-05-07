import { StyleSheet, View, ViewProps } from "react-native";
import { Text, TextProps } from "react-native-paper";

interface TitledTextProps extends Omit<ViewProps, "children"> {
  title: string;
  titleProps?: Omit<TextProps<string>, "children">;
  text: React.ReactNode;
  textProps?: Omit<TextProps<string>, "children">;
}

const TitledText = ({ title, text, style, titleProps, textProps, ...props }: TitledTextProps) => (
  <View style={[Styles.view, style]} {...props}>
    <Text variant="bodyMedium" {...titleProps}>
      {title}:
    </Text>
    <Text variant="titleMedium" style={Styles.text} {...textProps}>
      {text}
    </Text>
  </View>
);

const Styles = StyleSheet.create({
  view: { flex: 1, minHeight: 60, gap: 10 },
  text: { paddingLeft: 5 },
});

export default TitledText;
