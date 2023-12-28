import { makeStyles } from "@rneui/themed";
import { Image, View } from "react-native";
import { SharedElement } from "react-navigation-shared-element";

import { appSuggestions } from "@/data/appSuggestions";
import { IStackScreenProps } from "@/types/navigation";

const AppSuggestionDetailScreen = ({
  navigation,
  route,
}: IStackScreenProps<"AppSuggestionDetail">) => {
  const styles = useStyles();
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

const useStyles = makeStyles((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.black,
  },
}));
