import { appSuggestions } from "@/data/appSuggestions";
import { IRootStackScreenProps } from "@/types/navigation";
import { useNavigation } from "@react-navigation/native";
import { Image, StyleSheet, Text, View, Modal } from "react-native";
import { SharedElement } from "react-navigation-shared-element";

const AppSuggestionDetailScreen = ({
  navigation,
  route,
}: IRootStackScreenProps<"AppSuggestionDetail">) => {
  const appSuggestion = appSuggestions.find(
    (item) => item.id === route.params.id
  );

  if (!appSuggestion) return null;

  return (
    <View style={styles.container}>
      <SharedElement id={`appSuggestion.${appSuggestion.id}.photo`}>
        <Image
          source={{ uri: appSuggestion.imageUrl }}
          style={{
            width: "100%",
            aspectRatio: 3 / 4,
          }}
        />
      </SharedElement>
    </View>
  );
};

export default AppSuggestionDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
