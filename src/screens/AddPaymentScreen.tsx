import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import {
  MaterialTopTabScreenProps,
  createMaterialTopTabNavigator,
} from "@react-navigation/material-top-tabs";
import { Text, makeStyles } from "@rneui/themed";
import { useEffect } from "react";
import { View } from "react-native";

import SampleScreen from "./SampleScreen";

import AddBillForm from "@/components/addPayment/AddBillForm";
import { useAppSelector } from "@/hooks/reduxHook";
import { IStackScreenProps } from "@/types/navigation";

type IAddPaymentTabParamList = {
  Bill: { groupId: string };
  "Who paid?": { groupId: string };
  Settings: { groupId: string };
};

export type IAddPaymentTabScreenProps<
  Screen extends keyof IAddPaymentTabParamList,
> = MaterialTopTabScreenProps<IAddPaymentTabParamList, Screen>;

const Tab = createMaterialTopTabNavigator<IAddPaymentTabParamList>();

const AddPaymentScreen = ({
  navigation,
  route: {
    params: { groupId },
  },
}: IStackScreenProps<"AddPayment">) => {
  const styles = useStyles();

  const group = useAppSelector((state) =>
    state.groups.groups.find((group) => group.id === groupId)
  );

  useEffect(() => {
    navigation.setOptions({ title: group?.name, headerBackTitle: "" });
  }, [group?.name, navigation]);

  if (!group)
    return (
      <View style={styles.container}>
        <Text>Group not found</Text>
      </View>
    );

  return (
    <BottomSheetModalProvider>
      <View style={styles.container}>
        <Tab.Navigator>
          <Tab.Screen
            name="Bill"
            component={AddBillForm}
            initialParams={{ groupId }}
            options={{ title: "Bill" }}
          />
          <Tab.Screen
            name="Who paid?"
            component={SampleScreen}
            options={{ title: "Who paid?" }}
          />
          <Tab.Screen
            name="Settings"
            component={SampleScreen}
            options={{ title: "For who?" }}
          />
        </Tab.Navigator>
      </View>
    </BottomSheetModalProvider>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
}));

export default AddPaymentScreen;
