import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import React from "react";

import { BottomNavigationBar } from "@/components";

export default function TabLayout() {
  return (
    <Tabs
      initialRouteName="index"
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <BottomNavigationBar tabBarProps={props} />}
    >
      <Tabs.Screen
        name="list"
        options={{ title: "List", tabBarIcon: ({ color }) => <FontAwesome size={24} name="list" color={color} /> }}
      />
      <Tabs.Screen
        name="index"
        options={{ title: "Home", tabBarIcon: ({ color }) => <FontAwesome size={24} name="home" color={color} /> }}
      />
      <Tabs.Screen
        name="settings"
        options={{ title: "Settings", tabBarIcon: ({ color }) => <FontAwesome size={24} name="cog" color={color} /> }}
      />
    </Tabs>
  );
}
