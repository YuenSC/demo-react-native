import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { memo } from "react";

import StackNavigator from "./StackNavigator";

import AppSuggestionListScreen from "@/screens/AppSuggestionListScreen";
import SampleScreen from "@/screens/SampleScreen";
import {
  IBottomTabParamList,
  ITopTabParamList,
  ITopTabScreenProps,
} from "@/types/navigation";

const TopTab = createMaterialTopTabNavigator<ITopTabParamList>();
const BottomTab = createBottomTabNavigator<IBottomTabParamList>();

const BottomTabNavigator = memo(
  ({ navigation }: ITopTabScreenProps<"BottomTab">) => (
    <BottomTab.Navigator
      id="BottomTab"
      screenListeners={{
        state: (e) => {
          navigation.setOptions({
            swipeEnabled:
              (e?.data as { state: { index: number } })?.state?.index === 0,
          });
        },
      }}
    >
      <BottomTab.Screen
        name="Main"
        component={StackNavigator}
        options={{ headerShown: false }}
      />
      <BottomTab.Screen
        name="AppSuggestions"
        component={AppSuggestionListScreen}
      />
      <BottomTab.Screen name="Settings" component={SampleScreen} />
    </BottomTab.Navigator>
  )
);

const MainNavigation = () => {
  return (
    <TopTab.Navigator
      tabBar={() => null}
      id="TopTab"
      style={{ backgroundColor: "black" }}
    >
      <TopTab.Screen
        name="BottomTab"
        component={BottomTabNavigator}
        options={{ swipeEnabled: false }}
      />
      <TopTab.Screen name="Chat" component={SampleScreen} />
    </TopTab.Navigator>
  );
};

MainNavigation.displayName = "MainNavigation";
export default MainNavigation;
