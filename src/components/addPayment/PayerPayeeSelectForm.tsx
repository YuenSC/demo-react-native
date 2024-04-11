import { Entypo } from "@expo/vector-icons";
import { StackActions } from "@react-navigation/native";
import {
  Button,
  Input,
  ListItem,
  Text,
  makeStyles,
  useTheme,
} from "@rneui/themed";
import { useMemo } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { ScrollView, TouchableOpacity, View } from "react-native";

import { useAppDispatch, useAppSelector } from "@/hooks/reduxHook";
import { addPaymentRecord, updatePaymentRecord } from "@/store/reducers/groups";
import { groupUsersSelector } from "@/store/reducers/users";
import { PaymentRecord, PaymentRecordCreate } from "@/types/PaymentRecord";
import { IAddPaymentTabScreenProps } from "@/types/navigation";
import { getActualAmountPerUser } from "@/utils/payment";

const PayerPayeeSelectForm = ({
  navigation,
  route,
}: IAddPaymentTabScreenProps<"PayerSelect" | "PayeeSelect">) => {
  const styles = useStyles();
  const { theme } = useTheme();
  const type = route.name === "PayerSelect" ? "payers" : "payees";
  const dispatch = useAppDispatch();

  const groupIdWatch = useWatch({ name: "groupId" });
  const group = useAppSelector((state) =>
    state.groups.groups.find((group) => group.id === groupIdWatch),
  );
  const groupUsers = useAppSelector((state) =>
    groupUsersSelector(state, group?.id ?? ""),
  );
  const { control, handleSubmit, setValue } = useFormContext<
    PaymentRecordCreate & { id?: string }
  >();
  const amountWatch = useWatch({ name: "amount", control });
  const paymentRecords = useWatch({ name: type, control });
  const isEdit = Boolean(useWatch({ name: "id", control }));

  const { actualAmountPerUser, isPaymentEqualExpense } = useMemo(() => {
    return getActualAmountPerUser(amountWatch, paymentRecords);
  }, [amountWatch, paymentRecords]);

  return (
    <View style={styles.container}>
      <ScrollView keyboardDismissMode="on-drag">
        <Text style={styles.label}>
          {type === "payers" ? "Who Paid?" : "Paid For?"}
        </Text>
        {groupUsers.map((member) => {
          const index = paymentRecords.findIndex((i) => i.id === member.id);
          const actualAmount = actualAmountPerUser.find(
            (i) => i.id === member.id,
          )?.amount;

          return (
            <ListItem
              key={member.id}
              bottomDivider
              style={{ width: "100%" }}
              containerStyle={styles.item}
            >
              <ListItem.CheckBox
                iconType="material-community"
                checkedIcon="checkbox-marked"
                uncheckedIcon="checkbox-blank-outline"
                checked={Boolean(paymentRecords[index].amount)}
                onPress={() => {
                  const paymentPerUsersCopy = [...paymentRecords];
                  paymentPerUsersCopy[index].amount = paymentPerUsersCopy[index]
                    .amount
                    ? 0
                    : "auto";
                  setValue(type, paymentPerUsersCopy);
                }}
              />
              <ListItem.Content style={styles.itemContent}>
                <View style={styles.name}>
                  <ListItem.Title numberOfLines={1}>
                    {member.name}
                  </ListItem.Title>
                  {paymentRecords[index].amount === "auto" && (
                    <Text style={styles.autoTag}>(Auto)</Text>
                  )}
                </View>
                <View style={{ flex: 1 }}>
                  <Input
                    renderErrorMessage={false}
                    inputContainerStyle={styles.inputContainer}
                    inputStyle={styles.input}
                    placeholder="0"
                    value={actualAmount === 0 ? "" : actualAmount?.toString()}
                    keyboardType="numeric"
                    selection={{
                      start: (actualAmount ?? "")?.toString().length,
                      end: (actualAmount ?? "")?.toString().length,
                    }}
                    onChangeText={(text) => {
                      const paymentPerUsersCopy = [...paymentRecords];
                      const textAsNumber = parseFloat(text);

                      paymentPerUsersCopy[index].amount = Number.isNaN(
                        textAsNumber,
                      )
                        ? 0
                        : Math.min(
                            textAsNumber,
                            amountWatch -
                              actualAmountPerUser
                                .filter(({ id }) => id !== member.id)
                                .reduce((prev, curr) => prev + curr.amount, 0),
                          );
                      setValue(type, paymentPerUsersCopy);
                    }}
                    rightIcon={
                      <TouchableOpacity
                        onPress={() => {
                          const paymentPerUsersCopy = [...paymentRecords];
                          paymentPerUsersCopy[index].amount = 0;
                          setValue(type, paymentPerUsersCopy);
                        }}
                      >
                        <Entypo
                          name="circle-with-cross"
                          size={20}
                          color={theme.colors.grey3}
                          style={{ marginLeft: 4 }}
                        />
                      </TouchableOpacity>
                    }
                  />
                </View>
              </ListItem.Content>
            </ListItem>
          );
        })}
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title={type === "payers" ? "Next" : "Done"}
          disabled={!isPaymentEqualExpense}
          onPress={handleSubmit((values) => {
            switch (type) {
              case "payers":
                navigation.navigate("PayeeSelect");
                break;
              case "payees":
                if (isEdit) {
                  dispatch(updatePaymentRecord(values as PaymentRecord));
                } else {
                  dispatch(addPaymentRecord(values));
                }
                navigation.dispatch(StackActions.pop());
                break;
            }
          })}
        />
      </View>
    </View>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.modal,
    padding: 8,
    paddingTop: 32,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
  },
  label: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: "bold",
    color: theme.colors.grey3,
    marginBottom: 6,
  },
  footer: {
    position: "absolute",
    width: "100%",
    left: 8,
    padding: 16,
    bottom: 16,
  },
  inputContainer: {
    borderBottomWidth: 0,
    paddingHorizontal: 0,
  },
  item: {
    backgroundColor: theme.colors.modal,
  },
  itemContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: { textAlign: "right" },
  name: { flexDirection: "row", flex: 1, alignItems: "center" },
  autoTag: {
    fontSize: 12,
    paddingLeft: 4,
    color: theme.colors.grey3,
  },
}));

export default PayerPayeeSelectForm;
