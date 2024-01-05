import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { ScrollView } from "react-native";
import { SharedElement } from "react-navigation-shared-element";

import AppSuggestionDisplay from "@/components/appSuggestion/AppSuggestionDisplay";
import { appSuggestions } from "@/data/appSuggestions";
import { IBottomTabScreenProps } from "@/types/navigation";

const AppSuggestionListScreen = ({
  navigation,
}: IBottomTabScreenProps<"AppSuggestions">) => {
  return (
    <>
      <StatusBar style="dark" />
      <ScrollView
        contentContainerStyle={{
          padding: 16,
          gap: 32,
        }}
      >
        {appSuggestions.map((appSuggestion) => (
          <SharedElement
            key={appSuggestion.id}
            id={`appSuggestion.${appSuggestion.id}.photo`}
          >
            <AppSuggestionDisplay
              appSuggestion={appSuggestion}
              onPress={() =>
                navigation.navigate("Main", {
                  screen: "AppSuggestionDetail",
                  params: {
                    id: appSuggestion.id,
                  },
                })
              }
            />
          </SharedElement>
        ))}
      </ScrollView>
    </>
  );
};

export default AppSuggestionListScreen;
