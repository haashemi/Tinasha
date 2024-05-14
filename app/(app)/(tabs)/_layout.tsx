import { Tabs } from "expo-router";
import React from "react";
import { Icon } from "react-native-paper";

import { BottomNavigationBar } from "@/components";

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }} tabBar={(props) => <BottomNavigationBar tabBarProps={props} />}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Season",
          tabBarIcon: (props) => (
            <Icon size={props.size} color={props.color} source={props.focused ? "calendar" : "calendar-outline"} />
          ),
        }}
      />
      <Tabs.Screen
        name="list"
        options={{
          title: "List",
          tabBarIcon: (props) => (
            <Icon size={props.size} color={props.color} source={props.focused ? "view-list" : "view-list-outline"} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: (props) => (
            <Icon size={props.size} color={props.color} source={props.focused ? "account" : "account-outline"} />
          ),
        }}
      />
    </Tabs>
  );
}
