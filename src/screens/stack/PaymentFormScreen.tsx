import { AntDesign } from "@expo/vector-icons";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { Text, makeStyles, useTheme } from "@rneui/themed";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { TouchableOpacity, View } from "react-native";

import Config from "@/Config";
import BillForm from "@/components/addPayment/BillForm";
import PayerPayeeSelectForm from "@/components/addPayment/PayerPayeeSelectForm";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHook";
import { BillCategoryEnum } from "@/types/BillCategories";
import { PaymentRecordCreate } from "@/types/PaymentRecord";
import { IAddPaymentTabParamList, IStackScreenProps } from "@/types/navigation";

const Tab = createMaterialTopTabNavigator<IAddPaymentTabParamList>();

const PaymentFormScreen = ({
  navigation,
  route: {
    params: { groupId, recordId },
  },
}: IStackScreenProps<"AddPayment" | "EditPayment" | "EditPaymentModal">) => {
  const styles = useStyles();
  const { theme } = useTheme();
  const dispatch = useAppDispatch();

  const lastUsedCurrency = useAppSelector(
    (state) => state.groups.lastUsedCurrency ?? "HKD",
  );

  const group = useAppSelector((state) =>
    state.groups.groups.find((group) => group.id === groupId),
  );
  const record = group?.paymentRecords.find((item) => item.id === recordId);

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
          id: item.id,
        })) ?? [],
      payees:
        group?.members.map((item, index) => ({
          amount: "auto",
          id: item.id,
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
        payers:
          group?.members.map((user) => {
            const payer = record.payers.find((p) => p.id === user.id);
            if (payer) return payer;

            return {
              amount: 0,
              id: user.id,
            };
          }) ?? [],
        payees:
          group?.members.map((user) => {
            const payee = record.payees.find((p) => p.id === user.id);
            if (payee) return payee;

            return {
              amount: "auto",
              id: user.id,
            };
          }) ?? [],
      });
    }
  }, [group?.members, group?.name, navigation, record, reset]);

  useEffect(() => {
    if (record) {
      navigation.setOptions({
        headerRight: () => {
          return (
            <TouchableOpacity
              style={{ marginRight: 16 }}
              onPress={() => {
                navigation.navigate("GroupDeletePaymentRecordBottomSheet", {
                  groupId,
                  recordId: record.id,
                });
              }}
            >
              <AntDesign name="delete" size={24} color={theme.colors.error} />
            </TouchableOpacity>
          );
        },
      });
    }
  }, [dispatch, groupId, navigation, record, theme.colors.error]);

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
          <Tab.Navigator
            screenOptions={{
              tabBarStyle: {
                backgroundColor: theme.colors.modal,
              },
              tabBarLabelStyle: {
                color: theme.colors.black,
                fontWeight: "bold",
              },
              tabBarIndicatorStyle: {
                backgroundColor: theme.colors.primary,
              },
            }}
          >
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
    backgroundColor: theme.colors.modal,
  },
}));

export default PaymentFormScreen;
