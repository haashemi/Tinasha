import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { format } from "date-fns";
import { Image } from "expo-image";
import * as WebBrowser from "expo-web-browser";
import { useRef } from "react";
import { Appearance, ScrollView, View, useColorScheme } from "react-native";
import { Divider, Icon, List, RadioButton, Text } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useMyUserInformation } from "@/api";
import { useAppTheme } from "@/components";

export default function ProfileTab() {
  const theme = useAppTheme();
  const safeArea = useSafeAreaInsets();
  const { data } = useMyUserInformation();

  const themeSheet = useRef<BottomSheetModal>(null);
  const colorScheme = useColorScheme();

  const setColorScheme = (v: string) => {
    Appearance.setColorScheme(v === "dark" ? "dark" : v === "light" ? "light" : null);
    themeSheet.current?.close();
  };

  return (
    <>
      <BottomSheetModal
        ref={themeSheet}
        enableDynamicSizing
        stackBehavior="replace"
        handleIndicatorStyle={{ backgroundColor: theme.colors.onSurface }}
        backgroundStyle={{ backgroundColor: theme.colors.elevation.level2 }}
      >
        <BottomSheetView style={{ backgroundColor: theme.colors.elevation.level2, paddingBottom: safeArea.bottom }}>
          <View style={{ paddingTop: 10, paddingBottom: 30, gap: 20 }}>
            <Text variant="titleLarge" style={{ textAlign: "center" }}>
              Set Theme
            </Text>
            <RadioButton.Group onValueChange={setColorScheme} value={colorScheme ? colorScheme : "null"}>
              <RadioButton.Item label="Dark Theme" value="dark" />
              <RadioButton.Item label="Light Theme" value="light" />
              <RadioButton.Item label="System Preferences" value="null" />
            </RadioButton.Group>
          </View>
        </BottomSheetView>
      </BottomSheetModal>

      <ScrollView style={{ paddingTop: safeArea.top }}>
        <View style={{ padding: 30, flexDirection: "row" }}>
          <Image
            recyclingKey={`${data?.id}-${data?.name}`}
            style={{ width: 150, height: 200, borderRadius: theme.roundness * 4 }}
            source={data?.picture}
            contentFit="cover"
            transition={100}
          />

          <View style={{ justifyContent: "space-around", padding: 20 }}>
            <Text numberOfLines={1} adjustsFontSizeToFit variant="headlineMedium">
              {data?.name}
            </Text>

            {data?.birthday ? (
              <View style={{ flexDirection: "row", gap: 10 }}>
                <Icon size={20} source="cake-variant" />
                <Text variant="bodyLarge">{format(data.joined_at, "MMMM do, yyyy")}</Text>
              </View>
            ) : null}

            {data?.joined_at ? (
              <View style={{ flexDirection: "row", gap: 10 }}>
                <Icon size={20} source="calendar-check-outline" />
                <Text variant="bodyLarge">{format(data.joined_at, "MMMM do, yyyy")}</Text>
              </View>
            ) : null}
          </View>
        </View>

        <Divider />

        <List.Item
          title="Change Theme"
          description="Change the current Tinasha's theme."
          left={(props) => <List.Icon {...props} icon="theme-light-dark" />}
          onPress={() => themeSheet.current?.present()}
        />
        <List.Item
          title="GitHub"
          description="Tinasha's source code is publicly available! Give a star."
          left={(props) => <List.Icon {...props} icon="github" />}
          onPress={() => WebBrowser.openBrowserAsync("https://github.com/haashemi/Tinasha")}
        />

        {/* TODO: Add Statistics */}

        {/* TODO: Add Debug button */}
      </ScrollView>
    </>
  );
}
