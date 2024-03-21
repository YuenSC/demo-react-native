import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import {
  MaterialTopTabScreenProps,
  createMaterialTopTabNavigator,
} from "@react-navigation/material-top-tabs";
import { Text, makeStyles } from "@rneui/themed";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { View } from "react-native";

import Config from "@/Config";
import BillForm from "@/components/addPayment/BillForm";
import PayeeSelectForm from "@/components/addPayment/PayeeSelectForm";
import PayerSelectForm from "@/components/addPayment/PayerSelectForm";
import { useAppSelector } from "@/hooks/reduxHook";
import { BillCategoryEnum } from "@/types/BillCategories";
import { PaymentRecordCreate } from "@/types/PaymentRecord";
import { IStackScreenProps } from "@/types/navigation";

type IAddPaymentTabParamList = {
  Bill: undefined;
  PayeeSelect: undefined;
  PayerSelect: undefined;
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

  const lastUsedCurrency = useAppSelector(
    (state) => state.groups.lastUsedCurrency ?? "HKD"
  );

  const group = useAppSelector((state) =>
    state.groups.groups.find((group) => group.id === groupId)
  );

  const form = useForm<PaymentRecordCreate>({
    defaultValues: {
      amount: Config.isDev ? 1000 : 0,
      currencyCode: lastUsedCurrency,
      groupId,
      date: new Date().toISOString(),
      category: BillCategoryEnum.Transportation,
      comment: Config.isDev ? "Example Comment" : "",
      payers:
        group?.members.map((item, index) => ({
          amount: index === 0 ? "auto" : 0,
          userId: item.id,
        })) ?? [],
      payees:
        group?.members.map((item, index) => ({
          amount: "auto",
          userId: item.id,
        })) ?? [],
    },
  });

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
              component={BillForm}
              options={{ title: "Bill" }}
            />
            <Tab.Screen
              name="PayerSelect"
              component={PayerSelectForm}
              options={{ title: "Payer" }}
            />
            <Tab.Screen
              name="PayeeSelect"
              component={PayeeSelectForm}
              options={{ title: "Payee" }}
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
