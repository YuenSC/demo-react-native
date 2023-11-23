import AppSuggestionDetailScreen from "@/screens/AppSuggestionDetailScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { memo } from "react";
import { StyleSheet } from "react-native";
import { createSharedElementStackNavigator } from "react-navigation-shared-element";
import { IRootStackParamList } from "@/types/navigation";
import MainNavigation from "./MainNavigation";

const Stack = createSharedElementStackNavigator<IRootStackParamList>();

const StackNavigator = memo(() => (
  <Stack.Navigator>
    <Stack.Screen
      name="Root"
      component={MainNavigation}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="AppSuggestionDetail"
      component={AppSuggestionDetailScreen}
      options={{
        headerTransparent: true,
      }}
      sharedElements={(route, otherRoute, showing) => {
        const { id } = route.params;
        return [
          {
            id: `appSuggestion.${id}.photo`,
            animation: "fade",
          },
        ];
      }}
    />
  </Stack.Navigator>
));

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});

StackNavigator.displayName = "StackNavigator";
export default StackNavigator;
