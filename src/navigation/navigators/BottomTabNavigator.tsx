import AppSuggestionListScreen from "@/screens/AppSuggestionListScreen";
import SampleScreen from "@/screens/SampleScreen";
import { IRootTabParamList } from "@/types/navigation";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { memo } from "react";
import { StyleSheet } from "react-native";

const Tab = createBottomTabNavigator<IRootTabParamList>();

const BottomTabNavigator = memo(() => (
  <Tab.Navigator screenOptions={{ headerShown: false }}>
    <Tab.Screen name="Home" component={AppSuggestionListScreen} />
    <Tab.Screen name="Settings" component={SampleScreen} />
  </Tab.Navigator>
));

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});

BottomTabNavigator.displayName = "BottomTabNavigator";
export default BottomTabNavigator;
