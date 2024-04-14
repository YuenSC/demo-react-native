import { AntDesign } from "@expo/vector-icons";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { Text, makeStyles, useTheme } from "@rneui/themed";
import { useEffect, useMemo } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { TouchableOpacity, View } from "react-native";

import Config from "@/Config";
import BillForm from "@/components/addPayment/BillForm";
import PayerPayeeSelectForm from "@/components/addPayment/PayerPayeeSelectForm";
import { useAppSelector } from "@/hooks/reduxHook";
import { LanguageEnum } from "@/i18n";
import { groupUsersSelector } from "@/store/reducers/users";
import { BillCategoryEnum } from "@/types/BillCategories";
import { getCurrencyBasedOnLanguage } from "@/types/Currency";
import { PaymentRecordCreate } from "@/types/PaymentRecord";
import { IAddPaymentTabParamList, IStackScreenProps } from "@/types/navigation";

const Tab = createMaterialTopTabNavigator<IAddPaymentTabParamList>();

const PaymentFormScreen = ({
  navigation,
  route: {
    params: { groupId, recordId, defaultValue },
    name,
  },
}: IStackScreenProps<"AddPayment" | "EditPayment" | "EditPaymentModal">) => {
  const styles = useStyles(name);
  const { theme } = useTheme();
  const { t, i18n } = useTranslation();

  const lastUsedCurrency = useAppSelector(
    (state) =>
      state.groups.lastUsedCurrency ??
      getCurrencyBasedOnLanguage(i18n.language as LanguageEnum),
  );

  const group = useAppSelector((state) =>
    state.groups.groups.find((group) => group.id === groupId),
  );
  const groupUsers = useAppSelector((state) =>
    groupUsersSelector(state, groupId),
  );
  const memoizedGroupUsers = useMemo(() => groupUsers, [groupUsers]);
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
        groupUsers.map((item, index) => ({
          amount: index === 0 ? "auto" : 0,
          id: item.id,
        })) ?? [],
      payees:
        groupUsers.map((item, index) => ({
          amount: "auto",
          id: item.id,
        })) ?? [],
    },
  });
  const { reset } = form;

  useEffect(() => {
    navigation.setOptions({ title: group?.name, headerBackTitle: "" });
    const resetValues = record || defaultValue;

    if (resetValues) {
      reset({
        id: resetValues.id,
        amount: resetValues.amount,
        currencyCode: resetValues.currencyCode,
        groupId: resetValues.groupId,
        date: resetValues.date,
        category: resetValues.category,
        comment: resetValues.comment,
        payers:
          memoizedGroupUsers.map((user) => {
            const payer = resetValues.payers.find((p) => p.id === user.id);
            if (payer) return payer;

            return {
              amount: 0,
              id: user.id,
            };
          }) ?? [],
        payees:
          memoizedGroupUsers.map((user) => {
            const payee = resetValues.payees.find((p) => p.id === user.id);
            if (payee) return payee;

            return {
              amount: 0,
              id: user.id,
            };
          }) ?? [],
      });
    }
  }, [
    defaultValue,
    group?.name,
    memoizedGroupUsers,
    navigation,
    record,
    reset,
  ]);

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
  }, [groupId, navigation, record, theme.colors.error]);

  if (!group)
    return (
      <View style={styles.container}>
        <Text>Group not found</Text>
      </View>
    );

  return (
    <BottomSheetModalProvider>
      <FormProvider {...form}>
        <View style={[[styles.container, styles.backgroundColor]]}>
          <Tab.Navigator
            sceneContainerStyle={styles.backgroundColor}
            screenOptions={{
              tabBarStyle: styles.backgroundColor,
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
              options={{ title: t("PaymentFormScreen:bill") }}
            />
            <Tab.Screen
              name="PayerSelect"
              component={PayerPayeeSelectForm}
              options={{ title: t("PaymentFormScreen:who-paid") }}
            />
            <Tab.Screen
              name="PayeeSelect"
              component={PayerPayeeSelectForm}
              options={{
                title: t("PaymentFormScreen:paid-for"),
              }}
            />
          </Tab.Navigator>
        </View>
      </FormProvider>
    </BottomSheetModalProvider>
  );
};

const useStyles = makeStyles(
  (theme, name: "AddPayment" | "EditPayment" | "EditPaymentModal") => ({
    container: {
      flex: 1,
    },
    backgroundColor: {
      backgroundColor:
        name === "EditPayment" ? theme.colors.background : theme.colors.modal,
    },
  }),
);

export default PaymentFormScreen;
