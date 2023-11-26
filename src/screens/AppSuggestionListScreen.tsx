import AppSuggestionDisplay from "@/components/appSuggestion/AppSuggestionDisplay";
import { appSuggestions } from "@/data/appSuggestions";
import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { ScrollView } from "react-native";
import { SharedElement } from "react-navigation-shared-element";

const AppSuggestionListScreen = () => {
  const navigation = useNavigation();

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
                navigation.navigate("AppSuggestionDetail", {
                  id: appSuggestion.id,
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
