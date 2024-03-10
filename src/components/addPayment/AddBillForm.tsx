import { AntDesign } from "@expo/vector-icons";
import BottomSheet from "@gorhom/bottom-sheet";
// eslint-disable-next-line no-restricted-imports
import { Input as BaseInput } from "@rneui/base";
import { Input, Text, makeStyles } from "@rneui/themed";
import { memo, useImperativeHandle, useRef } from "react";
import { useController, useForm, useWatch } from "react-hook-form";
import { ScrollView, TextInput, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import BillCalculatorBottomSheet from "./BillCalculatorBottomSheet";

import { IAddPaymentTabScreenProps } from "@/screens/AddPaymentScreen";
import { PaymentRecordCreate } from "@/types/PaymentRecord";

const AddBillForm = ({
  route: {
    params: { groupId },
  },
}: IAddPaymentTabScreenProps<"Bill">) => {
  const insets = useSafeAreaInsets();
  const styles = useStyles(insets);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const inputRef = useRef<TextInput & BaseInput>(null);

  const { control, register } = useForm<PaymentRecordCreate>({
    defaultValues: {
      amount: 0,
      currencyCode: "HKD",
      groupId,
      date: new Date().toISOString(),
    },
  });

  const currencyCodeWatch = useWatch({ control, name: "currencyCode" });

  const {
    field: { ref, onChange, onBlur, value },
  } = useController({ name: "amount", control });
  useImperativeHandle(ref, () => inputRef.current, []);

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.container}
        keyboardDismissMode="on-drag"
        onScrollBeginDrag={() => bottomSheetRef.current?.close()}
      >
        {/* Bill */}
        <Input
          ref={inputRef}
          label="Bill Amount"
          placeholder="$XXX"
          style={styles.input}
          leftIcon={
            <TouchableOpacity style={styles.currencyButton}>
              <Text style={styles.currencyButtonText}>{currencyCodeWatch}</Text>
              <AntDesign name="caretdown" />
            </TouchableOpacity>
          }
          containerStyle={styles.inputContainer}
          showSoftInputOnFocus={false}
          value={value === 0 ? undefined : value.toLocaleString()}
          onFocus={() => bottomSheetRef.current?.snapToIndex(0)}
          onBlur={() => {
            bottomSheetRef.current?.close();
            onBlur();
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
        ref={bottomSheetRef}
        amount={value}
        setAmount={onChange}
        onBlurInput={() => inputRef.current?.blur()}
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
