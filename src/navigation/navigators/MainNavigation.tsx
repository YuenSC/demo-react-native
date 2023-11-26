import AppSuggestionListScreen from "@/screens/AppSuggestionListScreen";
import HomeScreen from "@/screens/HomeScreen";
import SampleScreen from "@/screens/SampleScreen";
import {
  IBottomTabParamList,
  ITopTabParamList,
  ITopTabScreenProps,
} from "@/types/navigation";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { memo } from "react";

const TopTab = createMaterialTopTabNavigator<ITopTabParamList>();
const BottomTab = createBottomTabNavigator<IBottomTabParamList>();

const BottomTabNavigator = memo(
  ({ navigation }: ITopTabScreenProps<"BottomTab">) => (
    <BottomTab.Navigator
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
        name="Home"
        component={HomeScreen}
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
    <TopTab.Navigator tabBar={() => null}>
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
