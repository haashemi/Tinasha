import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { BottomNavigation } from "react-native-paper";

type RNBottomNavigationBarProps = Omit<
  React.ComponentProps<typeof BottomNavigation.Bar>,
  "onTabPress" | "navigationState"
>;

interface BottomNavigationBarProps extends RNBottomNavigationBarProps {
  tabBarProps: BottomTabBarProps;
}

const BottomNavigationBar = ({ tabBarProps, ...props }: BottomNavigationBarProps) => {
  const { navigation, state, descriptors, insets } = tabBarProps;

  return (
    <BottomNavigation.Bar
      {...props}
      navigationState={state}
      safeAreaInsets={insets}
      onTabPress={({ route, defaultPrevented, preventDefault }) => {
        if (defaultPrevented) return preventDefault();
        navigation.navigate(route);
      }}
      renderIcon={({ route, focused, color }) => {
        const { options } = descriptors[route.key];
        if (options.tabBarIcon) {
          return options.tabBarIcon({ focused, color, size: 24 });
        }

        return null;
      }}
      getLabelText={({ route }) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel.toString()
            : options.title !== undefined
              ? options.title
              : route.title;

        return label;
      }}
    />
  );
};

export default BottomNavigationBar;
