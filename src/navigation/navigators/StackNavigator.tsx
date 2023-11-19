import AppSuggestionDetailScreen from "@/screens/AppSuggestionDetailScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { memo } from "react";
import { StyleSheet } from "react-native";
import BottomTabNavigator from "./BottomTabNavigator";

const Stack = createNativeStackNavigator();

const StackNavigator = memo(() => (
  <Stack.Navigator screenOptions={{ headerShown: true }}>
    <Stack.Screen name="BottomTab" component={BottomTabNavigator} />
    <Stack.Screen
      name="AppSuggestionDetail"
      component={AppSuggestionDetailScreen}
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
