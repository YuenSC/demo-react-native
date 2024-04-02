import { Entypo } from "@expo/vector-icons";
import { DrawerActions, StackActions } from "@react-navigation/native";
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
import { IAddPaymentTabScreenProps } from "@/screens/stack/AddPaymentScreen";
import { addPaymentRecord } from "@/store/reducers/groups";
import { PaymentRecordCreate } from "@/types/PaymentRecord";

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
  const { control, handleSubmit, setValue } =
    useFormContext<PaymentRecordCreate>();
  const amountWatch = useWatch({ name: "amount", control });
  const paymentPerUsers = useWatch({ name: type, control });

  const { realAmountPerUsers, isEnoughToPaid } = useMemo(() => {
    const autoSplitCount = paymentPerUsers.filter(
      (i) => i.amount === "auto",
    ).length;

    const amountPaid = paymentPerUsers
      .filter((i) => i.amount !== "auto")
      .reduce((prev, curr) => prev + (curr.amount as number), 0);
    const autoSplitAmount =
      autoSplitCount === 0
        ? 0
        : Math.max(0, (amountWatch - amountPaid) / autoSplitCount);
    const realAmountPerUsers = paymentPerUsers.map((i) =>
      i.amount === "auto"
        ? parseFloat(autoSplitAmount.toFixed(2))
        : i.amount ?? 0,
    );
    const realAmountSum = realAmountPerUsers.reduce(
      (prev, curr) => prev + curr,
      0,
    );

    return {
      realAmountPerUsers,
      isEnoughToPaid: Math.round(realAmountSum) === amountWatch,
    };
  }, [amountWatch, paymentPerUsers]);

  return (
    <View style={styles.container}>
      <ScrollView keyboardDismissMode="on-drag">
        <Text style={styles.label}>
          {type === "payers" ? "Who Paid?" : "Paid For?"}
        </Text>
        {group?.members.map((member, index) => (
          <ListItem key={member.id} bottomDivider style={{ width: "100%" }}>
            <ListItem.CheckBox
              iconType="material-community"
              checkedIcon="checkbox-marked"
              uncheckedIcon="checkbox-blank-outline"
              checked={Boolean(paymentPerUsers[index].amount)}
              onPress={() => {
                const paymentPerUsersCopy = [...paymentPerUsers];
                paymentPerUsersCopy[index].amount = paymentPerUsersCopy[index]
                  .amount
                  ? 0
                  : "auto";
                setValue(type, paymentPerUsersCopy);
              }}
            />
            <ListItem.Content style={styles.itemContent}>
              <View style={styles.name}>
                <ListItem.Title numberOfLines={1}>{member.name}</ListItem.Title>
                {paymentPerUsers[index].amount === "auto" && (
                  <Text style={styles.autoTag}>(Auto)</Text>
                )}
              </View>
              <View style={{ flex: 1 }}>
                <Input
                  renderErrorMessage={false}
                  inputContainerStyle={styles.inputContainer}
                  inputStyle={styles.input}
                  placeholder="0"
                  value={
                    realAmountPerUsers[index] === 0
                      ? ""
                      : realAmountPerUsers[index]?.toString()
                  }
                  keyboardType="numeric"
                  selection={{
                    start: realAmountPerUsers[index]?.toString().length,
                    end: realAmountPerUsers[index]?.toString().length,
                  }}
                  onChangeText={(text) => {
                    const paymentPerUsersCopy = [...paymentPerUsers];
                    const textAsNumber = parseFloat(text);

                    paymentPerUsersCopy[index].amount = Number.isNaN(
                      textAsNumber,
                    )
                      ? 0
                      : Math.min(
                          textAsNumber,
                          amountWatch -
                            realAmountPerUsers
                              .filter((_, i) => i !== index)
                              .reduce((prev, curr) => prev + curr, 0),
                        );
                    setValue(type, paymentPerUsersCopy);
                  }}
                  rightIcon={
                    <TouchableOpacity
                      onPress={() => {
                        const paymentPerUsersCopy = [...paymentPerUsers];
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
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title={type === "payers" ? "Next" : "Done"}
          disabled={!isEnoughToPaid}
          onPress={handleSubmit((values) => {
            switch (type) {
              case "payers":
                navigation.navigate("PayeeSelect");
                break;
              case "payees":
                dispatch(addPaymentRecord(values));
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
    backgroundColor: theme.colors.background,
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
