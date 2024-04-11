import {
  AntDesign,
  FontAwesome,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { DrawerActions } from "@react-navigation/native";
import { useTheme } from "@rneui/themed";
import { TouchableOpacity } from "react-native";

import BottomTabBar from "../BottomTabBar";

import { HStack } from "@/components/common/Stack";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHook";
import SampleScreen from "@/screens/SampleScreen";
import GroupDetailScreen from "@/screens/bottomTab/GroupDetailScreen";
import OptionsScreen from "@/screens/bottomTab/OptionsScreen";
import PaymentRecordListScreen from "@/screens/bottomTab/PaymentRecordListScreen";
import {
  addPaymentRecord,
  currentGroupSelector,
} from "@/store/reducers/groups";
import { BillCategoryEnum } from "@/types/BillCategories";
import { PaymentRecordCreate } from "@/types/PaymentRecord";
import { IBottomTabParamList } from "@/types/navigation";

const BottomTab = createBottomTabNavigator<IBottomTabParamList>();

const BottomTabNavigator = () => {
  const { theme } = useTheme();
  const dispatch = useAppDispatch();
  const currentGroup = useAppSelector(currentGroupSelector);

  const generateRandomPaymentRecord = (index: number) => {
    const currentMembers = currentGroup?.members;
    if (!currentMembers || currentMembers.length < 2) {
      return;
    }

    const userIndexes = Array.from(Array(currentMembers.length).keys());
    const payerIndex =
      userIndexes[Math.floor(Math.random() * userIndexes.length)];

    const currentDate = new Date();
    currentDate.setDate(
      currentDate.getDate() - Math.floor(Math.random() * 365),
    );
    currentDate.setMinutes(Math.floor(Math.random() * 60));
    currentDate.setHours(Math.floor(Math.random() * 24));

    const randomCategory =
      Object.values(BillCategoryEnum)[
        Math.floor(Math.random() * Object.values(BillCategoryEnum).length)
      ];

    const paymentRecord = {
      id: undefined,
      groupId: currentGroup?.id,
      amount: Math.floor(Math.random() * 1000),
      category: randomCategory,
      comment: "Random Payment " + index,
      date: currentDate.toISOString(),
      currencyCode: Math.random() > 0.5 ? "JPY" : "HKD",
      payers: [{ amount: "auto", id: currentMembers[payerIndex].id }],
      payees: currentMembers.map((member) => ({
        amount: "auto",
        id: member.id,
      })),
    } satisfies PaymentRecordCreate;

    dispatch(addPaymentRecord(paymentRecord));
  };

  return (
    <BottomTab.Navigator
      screenOptions={({ navigation }) => ({
        headerTitle: "",
        headerStyle: {
          backgroundColor: theme.colors.background,
        },
        headerTintColor: theme.colors.black,
        headerLeft: () => (
          <TouchableOpacity
            style={{ marginLeft: 16 }}
            onPress={() => navigation.dispatch(DrawerActions.toggleDrawer)}
          >
            <Ionicons name="menu" size={24} color={theme.colors.black} />
          </TouchableOpacity>
        ),

        headerRight: () => {
          return (
            <HStack gap={8} style={{ marginRight: 16 }}>
              <TouchableOpacity
                onPress={() => {
                  Array.from(Array(1).keys()).forEach((index) =>
                    generateRandomPaymentRecord(index),
                  );
                }}
                onLongPress={() => {
                  Array.from(Array(10).keys()).forEach((index) =>
                    generateRandomPaymentRecord(index),
                  );
                }}
              >
                <AntDesign name="plus" size={24} color={theme.colors.error} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => AsyncStorage.clear()}>
                <FontAwesome name="undo" size={24} color={theme.colors.error} />
              </TouchableOpacity>
            </HStack>
          );
        },
      })}
      tabBar={(props) => <BottomTabBar groupId={currentGroup?.id} {...props} />}
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
        name="PaymentRecordList"
        component={PaymentRecordListScreen}
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
        component={OptionsScreen}
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
