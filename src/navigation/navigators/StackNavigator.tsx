import AppSuggestionDetailScreen from "@/screens/AppSuggestionDetailScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { memo } from "react";
import { StyleSheet } from "react-native";
import BottomTabNavigator from "./BottomTabNavigator";
import { createSharedElementStackNavigator } from "react-navigation-shared-element";
import { IRootStackParamList } from "@/types/navigation";

const Stack = createSharedElementStackNavigator<IRootStackParamList>();

const StackNavigator = memo(() => (
  <Stack.Navigator screenOptions={{ headerShown: true }}>
    <Stack.Screen name="Root" component={BottomTabNavigator} />
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
