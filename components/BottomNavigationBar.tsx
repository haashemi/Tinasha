import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useCallback } from "react";
import { BottomNavigation } from "react-native-paper";
import { Route } from "react-native-tab-view";

type RNBottomNavigationBarProps = Omit<
  React.ComponentProps<typeof BottomNavigation.Bar>,
  "onTabPress" | "navigationState"
>;

interface BottomNavigationBarProps extends RNBottomNavigationBarProps {
  tabBarProps: BottomTabBarProps;
}

type OnTabPressProps = { route: Route; defaultPrevented: boolean; preventDefault(): void };

type RenderIconProps = { route: Route; focused: boolean; color: string };

type GetLabelTextProps = { route: Route };

const BottomNavigationBar = ({ tabBarProps, ...props }: BottomNavigationBarProps) => {
  const { navigation, state, descriptors, insets } = tabBarProps;

  const onTabPress = useCallback(
    ({ route, defaultPrevented, preventDefault }: OnTabPressProps) => {
      if (defaultPrevented) return preventDefault();

      navigation.navigate(route);
    },
    [navigation],
  );

  const renderIcon = useCallback(
    ({ route, focused, color }: RenderIconProps) => {
      const { options } = descriptors[route.key];

      return options.tabBarIcon && options.tabBarIcon({ focused, color, size: 24 });
    },
    [descriptors],
  );

  const getLabelText = useCallback(
    ({ route }: GetLabelTextProps) => {
      const { options } = descriptors[route.key];
      const { tabBarLabel, title } = options;

      return tabBarLabel !== undefined ? tabBarLabel.toString() : title !== undefined ? title : route.title;
    },
    [descriptors],
  );

  return (
    <BottomNavigation.Bar
      {...props}
      navigationState={state}
      safeAreaInsets={insets}
      onTabPress={onTabPress}
      renderIcon={renderIcon}
      getLabelText={getLabelText}
    />
  );
};

export default BottomNavigationBar;
