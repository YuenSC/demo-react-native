import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { Text, makeStyles } from "@rneui/themed";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { useStep } from "usehooks-ts";

import SampleScreen from "./SampleScreen";

import AddBillForm from "@/components/addPayment/AddBillForm";
import { useAppSelector } from "@/hooks/reduxHook";
import { IStackScreenProps } from "@/types/navigation";

const Tab = createMaterialTopTabNavigator();

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
    <View style={styles.container}>
      <Tab.Navigator>
        <Tab.Screen
          name="Bill"
          component={AddBillForm}
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
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
}));

export default AddPaymentScreen;
