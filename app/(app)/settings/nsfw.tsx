import { View } from "react-native";
import { List } from "react-native-paper";

import { MaterialSwitchListItem } from "@/components/MaterialSwitchListItem";
import { useNSFW } from "@/context";

const NSFWScreen = () => {
  const {
    animeListNsfw,
    toggleAnimeListNsfw,
    seasonalAnimeNsfw,
    toggleSeasonalAnimeNsfw,
    userAnimeListNsfw,
    toggleUserAnimeListNsfw,
  } = useNSFW();

  return (
    <View>
      <MaterialSwitchListItem
        fluid
        selected={animeListNsfw}
        onPress={toggleAnimeListNsfw}
        title="NSFW in search"
        description="Include NSFW anime in search screen."
        leftIcon={(props) => <List.Icon icon="magnify" style={{ paddingLeft: 20 }} {...props} />}
      />
      <MaterialSwitchListItem
        fluid
        selected={seasonalAnimeNsfw}
        onPress={toggleSeasonalAnimeNsfw}
        title="NSFW in seasonal"
        description="Include NSFW anime in seasonal screen."
        leftIcon={(props) => <List.Icon icon="calendar" style={{ paddingLeft: 20 }} {...props} />}
      />
      <MaterialSwitchListItem
        fluid
        selected={userAnimeListNsfw}
        onPress={toggleUserAnimeListNsfw}
        title="NSFW in my list"
        description="Include NSFW anime in my anime list screen."
        leftIcon={(props) => <List.Icon icon="view-list" style={{ paddingLeft: 20 }} {...props} />}
      />
    </View>
  );
};

export default NSFWScreen;
