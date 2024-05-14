import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useCallback } from "react";
import { BottomNavigation } from "react-native-paper";
import type { Route } from "react-native-tab-view";

type RNBottomNavigationBarProps = Omit<
  React.ComponentProps<typeof BottomNavigation.Bar>,
  "navigationState" | "onTabPress"
>;

interface BottomNavigationBarProps extends RNBottomNavigationBarProps {
  tabBarProps: BottomTabBarProps;
}

interface OnTabPressProps {
  route: Route;
  defaultPrevented: boolean;
  preventDefault: () => void;
}

interface RenderIconProps {
  route: Route;
  focused: boolean;
  color: string;
}

interface GetLabelTextProps {
  route: Route;
}

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
      const descriptor = descriptors[route.key];
      if (!descriptor) return;

      const { options } = descriptor;

      return options.tabBarIcon?.({ focused, color, size: 24 });
    },
    [descriptors],
  );

  const getLabelText = useCallback(
    ({ route }: GetLabelTextProps) => {
      const descriptor = descriptors[route.key];
      if (!descriptor) return;

      const { options } = descriptor;
      const { tabBarLabel, title } = options;

      return tabBarLabel !== undefined ? tabBarLabel.toString() : title ?? route.title;
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
