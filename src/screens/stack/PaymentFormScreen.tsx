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
import PayerPayeeSelectForm from "@/components/addPayment/PayerPayeeSelectForm";
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

const PaymentFormScreen = ({
  navigation,
  route: {
    params: { groupId, recordId },
  },
}: IStackScreenProps<"AddPayment" | "EditPayment">) => {
  const styles = useStyles();

  const lastUsedCurrency = useAppSelector(
    (state) => state.groups.lastUsedCurrency ?? "HKD",
  );

  const group = useAppSelector((state) =>
    state.groups.groups.find((group) => group.id === groupId),
  );
  const record = group?.paymentRecords.find((item) => item.id === recordId);

  const form = useForm<PaymentRecordCreate & { id?: string }>({
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
  const { reset } = form;

  useEffect(() => {
    navigation.setOptions({ title: group?.name, headerBackTitle: "" });

    if (record) {
      reset({
        id: record.id,
        amount: record.amount,
        currencyCode: record.currencyCode,
        groupId: record.groupId,
        date: record.date,
        category: record.category,
        comment: record.comment,
        payers: record.payers,
        payees: record.payees,
      });
    }
  }, [group?.name, navigation, record, reset]);

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
              component={PayerPayeeSelectForm}
              options={{ title: "Who Paid?" }}
            />
            <Tab.Screen
              name="PayeeSelect"
              component={PayerPayeeSelectForm}
              options={{
                title: "Paid For?",
              }}
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

export default PaymentFormScreen;
