import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import React from "react";

import { BottomNavigationBar } from "@/components";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <BottomNavigationBar compact shifting tabBarProps={props} />}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Season",
          tabBarIcon: ({ color }) => <FontAwesome size={24} name="calendar" color={color} />,
        }}
      />
      <Tabs.Screen
        name="list"
        options={{
          title: "List",
          tabBarIcon: ({ color }) => <FontAwesome size={24} name="list" color={color} />,
        }}
      />
    </Tabs>
  );
}
