import ContentLoader, { Rect } from "react-content-loader/native";
import { ScrollView, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";

import type { CharacterNode } from "@/api";

import Image from "./Image";
import { useAppTheme } from "../context";

interface AnimeCharactersViewProps {
  isLoading: boolean;
  characters?: { node: CharacterNode; role: string }[];
}

// TODO: Add a placeholder for empty images.
const AnimeCharactersView = ({ isLoading, characters }: AnimeCharactersViewProps) => {
  const { colors, roundness } = useAppTheme();

  return (
    <View style={[Styles.mainView, { borderRadius: roundness * 3, backgroundColor: colors.elevation.level1 }]}>
      <Text variant="titleMedium" style={Styles.titleText}>
        Characters:
      </Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={Styles.scrollView}>
        {isLoading ? (
          <ContentLoader
            width={590}
            height={180}
            style={{ margin: 5 }}
            viewBox="0 0 590 180"
            backgroundColor={colors.elevation.level3}
            foregroundColor={colors.elevation.level5}
          >
            <Rect x="000" y="0" rx="10" ry="10" width="90" height="180" />
            <Rect x="100" y="0" rx="10" ry="10" width="90" height="180" />
            <Rect x="200" y="0" rx="10" ry="10" width="90" height="180" />
            <Rect x="300" y="0" rx="10" ry="10" width="90" height="180" />
            <Rect x="400" y="0" rx="10" ry="10" width="90" height="180" />
            <Rect x="500" y="0" rx="10" ry="10" width="90" height="180" />
          </ContentLoader>
        ) : (
          characters?.map(({ node, role }) => (
            <View
              key={node.id.toString()}
              style={[
                Styles.characterCard,
                { borderRadius: roundness * 2.5, backgroundColor: colors.elevation.level3 },
              ]}
            >
              <Image source={node.main_picture.medium} style={[Styles.image, { borderRadius: roundness * 2.5 }]} />

              <View style={Styles.nameView}>
                <Text numberOfLines={2}>
                  {node.first_name} {node.last_name}
                </Text>

                <Text variant="bodySmall" style={{ textAlign: "right", color: colors.tertiary }}>
                  {role}
                </Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const Styles = StyleSheet.create({
  mainView: { overflow: "hidden" },
  titleText: { paddingTop: 15, paddingHorizontal: 15 },
  scrollView: { padding: 10, paddingHorizontal: 10 },

  characterCard: { margin: 5, width: 90, height: 180 },
  image: { width: 90, aspectRatio: "4/5" },
  nameView: { height: 70, padding: 7, gap: 5, justifyContent: "space-between" },
});

export default AnimeCharactersView;
