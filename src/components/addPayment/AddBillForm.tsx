import { AntDesign } from "@expo/vector-icons";
import BottomSheet, { BottomSheetModal } from "@gorhom/bottom-sheet";
// eslint-disable-next-line no-restricted-imports
import { Input as BaseInput } from "@rneui/base";
import { Input, Text, makeStyles } from "@rneui/themed";
import { memo, useImperativeHandle, useRef } from "react";
import { useController, useForm } from "react-hook-form";
import { ScrollView, TextInput, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import BillCalculatorBottomSheet from "./BillCalculatorBottomSheet";
import CurrencySelectBottomSheet from "./CurrencySelectBottomSheet";

import { IAddPaymentTabScreenProps } from "@/screens/AddPaymentScreen";
import { PaymentRecordCreate } from "@/types/PaymentRecord";

const AddBillForm = ({
  route: {
    params: { groupId },
  },
  navigation,
}: IAddPaymentTabScreenProps<"Bill">) => {
  const insets = useSafeAreaInsets();
  const styles = useStyles(insets);
  const calculatorRef = useRef<BottomSheet>(null);
  const currencyRef = useRef<BottomSheetModal>(null);
  const amountInputRef = useRef<TextInput & BaseInput>(null);

  const { control, register } = useForm<PaymentRecordCreate>({
    defaultValues: {
      amount: 0,
      currencyCode: "HKD",
      groupId,
      date: new Date().toISOString(),
    },
  });

  const { field: amount } = useController({ name: "amount", control });
  const { field: currencyCode } = useController({
    name: "currencyCode",
    control,
  });
  useImperativeHandle(amount.ref, () => amountInputRef.current, []);

  const openCalculator = () => {
    calculatorRef.current?.snapToIndex(0);
    currencyRef.current?.close();
  };

  const openCurrency = () => {
    currencyRef.current?.present();
    amountInputRef.current?.blur();
    calculatorRef.current?.close();
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.container}
        keyboardDismissMode="on-drag"
        onScrollBeginDrag={() => {
          calculatorRef.current?.close();
          currencyRef.current?.close();
        }}
      >
        {/* Bill */}
        <Input
          ref={amountInputRef}
          label="Bill Amount"
          placeholder="$XXX"
          style={styles.input}
          leftIcon={
            <TouchableOpacity
              style={styles.currencyButton}
              onPress={openCurrency}
            >
              <Text style={styles.currencyButtonText}>
                {currencyCode.value}
              </Text>
              <AntDesign name="caretdown" />
            </TouchableOpacity>
          }
          containerStyle={styles.inputContainer}
          showSoftInputOnFocus={false}
          value={amount.value === 0 ? undefined : amount.value.toLocaleString()}
          onFocus={openCalculator}
          onBlur={() => {
            calculatorRef.current?.close();
            amount.onBlur();
          }}
        />

        {/* Comment and Date */}
        <Input
          label="Comment"
          placeholder="Describe this expense"
          {...register("comment")}
        />
        <Input
          label="Date"
          placeholder="When do you do it?"
          {...register("date")}
        />

        {/* Category */}
        <Text>Category</Text>
      </ScrollView>

      <BillCalculatorBottomSheet
        ref={calculatorRef}
        amount={amount.value}
        setAmount={amount.onChange}
        onBlurInput={() => amountInputRef.current?.blur()}
      />

      <CurrencySelectBottomSheet
        ref={currencyRef}
        currencyCode={currencyCode.value}
        setCurrencyCode={currencyCode.onChange}
      />
    </View>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: 8,
    paddingTop: 16,
  },
  input: {
    paddingLeft: 8,
    textAlign: "right",
    fontSize: 24,
    fontWeight: "bold",
  },
  inputContainer: {
    flex: 1,
  },
  currencyButton: { flexDirection: "row", alignItems: "center", gap: 4 },
  currencyButtonText: { fontSize: 24, fontWeight: "bold" },
  billInputContainer: {
    flexDirection: "row",
  },
}));

AddBillForm.displayName = "AddBillForm";

export default memo(AddBillForm);
