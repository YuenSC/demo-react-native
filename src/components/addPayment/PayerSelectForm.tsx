import { Entypo } from "@expo/vector-icons";
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

import { useAppSelector } from "@/hooks/reduxHook";
import { IAddPaymentTabScreenProps } from "@/screens/AddPaymentScreen";
import { PaymentRecordCreate } from "@/types/PaymentRecord";

const PayerSelectForm = ({
  navigation,
}: IAddPaymentTabScreenProps<"PayerSelect">) => {
  const styles = useStyles();
  const { theme } = useTheme();

  const groupIdWatch = useWatch({ name: "groupId" });
  const group = useAppSelector((state) =>
    state.groups.groups.find((group) => group.id === groupIdWatch)
  );
  const { control, handleSubmit, setValue } =
    useFormContext<PaymentRecordCreate>();
  const amountWatch = useWatch({
    name: "amount",
    control,
  });

  const paymentPerUsers = useWatch({
    name: "payers",
    control,
  });

  const { realAmountPerUsers, remainingAmount, isEnoughToPaid } =
    useMemo(() => {
      const autoSplitCount = paymentPerUsers.filter(
        (i) => i.amount === "auto"
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
          : i.amount ?? 0
      );

      const isEnoughToPaid =
        realAmountPerUsers.reduce((prev, curr) => prev + curr, 0) ===
        amountWatch;

      return {
        realAmountPerUsers,
        remainingAmount: amountWatch - amountPaid,
        isEnoughToPaid,
      };
    }, [amountWatch, paymentPerUsers]);

  return (
    <View style={styles.container}>
      <ScrollView keyboardDismissMode="on-drag">
        <Text style={styles.label}>Payer</Text>
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
                setValue("payers", paymentPerUsersCopy);
              }}
            />
            <ListItem.Content
              style={{ flexDirection: "row", alignItems: "center" }}
            >
              <ListItem.Title>{member.name}</ListItem.Title>
              <View style={{ flex: 1 }}>
                <Input
                  renderErrorMessage={false}
                  inputContainerStyle={{
                    borderBottomWidth: 0,
                    paddingHorizontal: 0,
                  }}
                  inputStyle={{ textAlign: "right" }}
                  value={realAmountPerUsers[index]?.toString()}
                  keyboardType="numeric"
                  selection={{
                    start: realAmountPerUsers[index]?.toString().length,
                    end: realAmountPerUsers[index]?.toString().length,
                  }}
                  onChangeText={(text) => {
                    const paymentPerUsersCopy = [...paymentPerUsers];
                    const temp = parseFloat(text);

                    console.log({
                      temp,
                      remainingAmount,
                      amountWatch,
                    });

                    paymentPerUsersCopy[index].amount = Number.isNaN(temp)
                      ? 0
                      : Math.min(
                          temp,
                          amountWatch -
                            realAmountPerUsers
                              .filter((_, i) => i !== index)
                              .reduce((prev, curr) => prev + curr, 0)
                        );
                    setValue("payers", paymentPerUsersCopy);
                  }}
                  rightIcon={
                    <TouchableOpacity
                      onPress={() => {
                        const paymentPerUsersCopy = [...paymentPerUsers];
                        paymentPerUsersCopy[index].amount = 0;
                        setValue("payers", paymentPerUsersCopy);
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
          title="Next"
          disabled={!isEnoughToPaid}
          onPress={handleSubmit(() => {
            navigation.navigate("PayeeSelect");
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
}));

export default PayerSelectForm;
