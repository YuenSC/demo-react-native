import AppStoreSharedAnimation from "@/screens/AppStoreSharedAnimationScreen";
import SampleScreen from "@/screens/SampleScreen";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { memo } from "react";
import { StyleSheet, Text, View } from "react-native";

const Tab = createBottomTabNavigator();

const BottomTabNavigator = memo(() => (
  <Tab.Navigator screenOptions={{ headerShown: false }}>
    <Tab.Screen name="Home" component={AppStoreSharedAnimation} />
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
