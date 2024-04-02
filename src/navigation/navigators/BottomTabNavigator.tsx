import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import BottomTabBar from "../BottomTabBar";

import { useAppSelector } from "@/hooks/reduxHook";
import SampleScreen from "@/screens/SampleScreen";
import GroupDetailScreen from "@/screens/bottomTab/GroupDetailScreen";
import PaymentRecordScreen from "@/screens/bottomTab/PaymentRecordScreen";
import { IBottomTabParamList } from "@/types/navigation";

const BottomTab = createBottomTabNavigator<IBottomTabParamList>();

const BottomTabNavigator = () => {
  const firstGroupId = useAppSelector((state) => state.groups?.groups?.[0]?.id);

  return (
    <BottomTab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <BottomTabBar groupId={firstGroupId} {...props} />}
    >
      <BottomTab.Screen
        name="GroupDetail"
        component={GroupDetailScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="home" size={24} color={color} />
          ),
          tabBarLabel: "Home",
        }}
      />
      <BottomTab.Screen
        name="PaymentRecord"
        component={PaymentRecordScreen}
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

// const useStyles = makeStyles((theme) => ({
//   headerRight: {
//     marginRight: 16,
//   },
// }));

export default BottomTabNavigator;
