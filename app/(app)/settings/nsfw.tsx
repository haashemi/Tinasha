import { View } from "react-native";
import { List, Switch } from "react-native-paper";

import { useAnimeListNsfw, useSeasonalAnimeNsfw, useUserAnimeListNsfw } from "@/hooks";

const NSFWScreen = () => {
  const [animeListNsfw, toggleAnimeListNsfw] = useAnimeListNsfw();
  const [seasonalAnimeNsfw, toggleSeasonalAnimeNsfw] = useSeasonalAnimeNsfw();
  const [userAnimeListNsfw, toggleUserAnimeListNsfw] = useUserAnimeListNsfw();

  return (
    <View>
      <List.Item
        title="NSFW in search"
        description="Include NSFW anime in search screen."
        left={(props) => <List.Icon {...props} icon="magnify" />}
        right={(props) => (
          <Switch
            color={props.color}
            style={props.style}
            value={animeListNsfw}
            onValueChange={(v) => toggleAnimeListNsfw()}
          />
        )}
      />
      <List.Item
        title="NSFW in seasonal"
        description="Include NSFW anime in seasonal screen."
        left={(props) => <List.Icon {...props} icon="calendar" />}
        right={(props) => (
          <Switch
            color={props.color}
            style={props.style}
            value={seasonalAnimeNsfw}
            onValueChange={(v) => toggleSeasonalAnimeNsfw()}
          />
        )}
      />
      <List.Item
        title="NSFW in my list"
        description="Include NSFW anime in my anime list screen."
        left={(props) => <List.Icon {...props} icon="view-list" />}
        right={(props) => (
          <Switch
            color={props.color}
            style={props.style}
            value={userAnimeListNsfw}
            onValueChange={(v) => toggleUserAnimeListNsfw()}
          />
        )}
      />
    </View>
  );
};

export default NSFWScreen;
