import { format } from "date-fns";
import { Image } from "expo-image";
import { ScrollView, View } from "react-native";
import { Divider, Icon, Text } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useMyUserInformation } from "@/api";
import { useAppTheme } from "@/components";

export default function ProfileTab() {
  const theme = useAppTheme();
  const safeArea = useSafeAreaInsets();
  const { data } = useMyUserInformation();

  return (
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

      {/* TODO: Add Statistics */}

      {/* TODO: Add Debug button */}
    </ScrollView>
  );
}
