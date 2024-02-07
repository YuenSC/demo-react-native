import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { makeStyles, useTheme } from "@rneui/themed";

import BottomTabBar from "../BottomTabBar";

import { useAppSelector } from "@/hooks/reduxHook";
import GroupDetailScreen from "@/screens/GroupDetailScreen";
import SampleScreen from "@/screens/SampleScreen";
import { IBottomTabParamList } from "@/types/navigation";

const BottomTab = createBottomTabNavigator<IBottomTabParamList>();

const BottomTabNavigator = () => {
  const styles = useStyles();
  const { theme } = useTheme();
  const firstGroupId = useAppSelector((state) => state.groups?.groups?.[0]?.id);

  return (
    <BottomTab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <BottomTabBar groupId={firstGroupId} {...props} />}
    >
      <BottomTab.Screen
        name="GroupDetail"
        component={GroupDetailScreen}
        initialParams={{ id: firstGroupId }}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="home" size={24} color={color} />
          ),
          tabBarLabel: "Home",
        }}
      />
      <BottomTab.Screen
        name="PaymentRecord"
        component={SampleScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="payment" size={24} color={color} />
          ),
          tabBarLabel: "Payment",
        }}
      />
      <BottomTab.Screen
        name="Statistic"
        component={SampleScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="stats-chart" size={24} color={color} />
          ),
          tabBarLabel: "Stats",
        }}
      />
      <BottomTab.Screen
        name="Option"
        component={SampleScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="options" size={24} color={color} />
          ),
          tabBarLabel: "Options",
        }}
      />
    </BottomTab.Navigator>
  );
};

const useStyles = makeStyles((theme) => ({
  headerRight: {
    marginRight: 16,
  },
}));

export default BottomTabNavigator;
