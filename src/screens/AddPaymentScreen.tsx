import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import {
  MaterialTopTabScreenProps,
  createMaterialTopTabNavigator,
} from "@react-navigation/material-top-tabs";
import { Text, makeStyles } from "@rneui/themed";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { View } from "react-native";

import SampleScreen from "./SampleScreen";

import AddBillForm from "@/components/addPayment/AddBillForm";
import { useAppSelector } from "@/hooks/reduxHook";
import { BillCategoryEnum } from "@/types/BillCategories";
import { PaymentRecordCreate } from "@/types/PaymentRecord";
import { IStackScreenProps } from "@/types/navigation";

type IAddPaymentTabParamList = {
  Bill: undefined;
  "Who paid?": undefined;
  Settings: undefined;
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

  const form = useForm<PaymentRecordCreate>({
    defaultValues: {
      amount: 0,
      currencyCode: "HKD",
      groupId,
      date: new Date().toISOString(),
      category: BillCategoryEnum.Transportation,
    },
  });

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
      <FormProvider {...form}>
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
      </FormProvider>
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
