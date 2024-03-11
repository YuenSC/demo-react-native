import { AntDesign } from "@expo/vector-icons";
import BottomSheet, { BottomSheetModal } from "@gorhom/bottom-sheet";
// eslint-disable-next-line no-restricted-imports
import { Input as BaseInput } from "@rneui/base";
import { Button, Input, Text, makeStyles } from "@rneui/themed";
import { memo, useImperativeHandle, useRef } from "react";
import { Controller, useController, useFormContext } from "react-hook-form";
import { ScrollView, TextInput, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import BillCalculatorBottomSheet from "./BillCalculatorBottomSheet";
import CurrencySelectBottomSheet from "./CurrencySelectBottomSheet";
import DatePickerBottomSheet from "./DatePickerBottomSheet";
import BillCategoryIcon from "../BillCategoryIcon";

import { IAddPaymentTabScreenProps } from "@/screens/AddPaymentScreen";
import { BillCategoryEnum } from "@/types/BillCategories";
import { PaymentRecordCreate } from "@/types/PaymentRecord";

const AddBillForm = ({ navigation }: IAddPaymentTabScreenProps<"Bill">) => {
  const insets = useSafeAreaInsets();
  const styles = useStyles(insets);
  const calculatorRef = useRef<BottomSheet>(null);
  const currencyRef = useRef<BottomSheetModal>(null);
  const dateBottomSheetRef = useRef<BottomSheetModal>(null);
  const amountInputRef = useRef<TextInput & BaseInput>(null);
  const dateInputRef = useRef<TextInput & BaseInput>(null);

  const { control, handleSubmit } = useFormContext<PaymentRecordCreate>();

  const {
    field: amount,
    fieldState: { error: amountError },
  } = useController({
    name: "amount",
    control,
    rules: {
      required: "Amount is required",
      min: {
        value: 1,
        message: "Amount is required",
      },
    },
  });

  const { field: currencyCode } = useController({
    name: "currencyCode",
    control,
  });
  const { field: date } = useController({
    name: "date",
    control,
  });
  const { field: category } = useController({
    name: "category",
    control,
  });
  useImperativeHandle(amount.ref, () => amountInputRef.current, []);

  const openCalculator = () => {
    calculatorRef.current?.snapToIndex(0);

    currencyRef.current?.close();

    dateInputRef.current?.blur();
    dateBottomSheetRef.current?.close();
  };

  const openCurrency = () => {
    currencyRef.current?.present();

    amountInputRef.current?.blur();
    calculatorRef.current?.close();

    dateInputRef.current?.blur();
    dateBottomSheetRef.current?.close();
  };

  const openDateBottomSheet = () => {
    dateBottomSheetRef.current?.present();

    amountInputRef.current?.blur();
    calculatorRef.current?.close();

    currencyRef.current?.close();
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.container}
        keyboardDismissMode="on-drag"
        onScrollBeginDrag={() => {
          calculatorRef.current?.close();
          currencyRef.current?.close();
          dateBottomSheetRef.current?.close();
        }}
      >
        {/* Bill */}
        <Input
          ref={amountInputRef}
          label="Bill Amount"
          placeholder="$XXX"
          style={styles.input}
          errorMessage={amountError?.message}
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
        <Controller
          control={control}
          rules={{ required: "Comment is required" }}
          name="comment"
          render={({
            field: { value, onChange, ref },
            fieldState: { error },
          }) => {
            return (
              <Input
                ref={ref}
                errorMessage={error?.message}
                value={value}
                label="Comment"
                placeholder="Describe this expense"
                onChangeText={onChange}
              />
            );
          }}
        />

        <Input
          ref={dateInputRef}
          label="Date"
          placeholder="When do you do it?"
          onFocus={openDateBottomSheet}
          showSoftInputOnFocus={false}
          value={
            date.value
              ? new Date(date.value).toLocaleDateString("en-US", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                })
              : undefined
          }
          onBlur={() => {
            dateBottomSheetRef.current?.close();
            date.onBlur();
          }}
        />

        {/* Category */}
        <Text style={styles.label}>Category</Text>
        <View style={styles.categoryGrid}>
          {Object.values(BillCategoryEnum).map((key) => {
            const isActive = category.value === key;

            return (
              <View key={key} style={styles.category}>
                <TouchableOpacity
                  onPress={() => category.onChange(key)}
                  activeOpacity={0.8}
                  style={[
                    styles.categoryButton,
                    isActive && styles.categoryButtonActive,
                  ]}
                >
                  <BillCategoryIcon
                    category={key as BillCategoryEnum}
                    color="white"
                  />
                </TouchableOpacity>
                <Text style={styles.categoryText}>{key}</Text>
              </View>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button title="Next" onPress={handleSubmit(() => {})} />
      </View>

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

      <DatePickerBottomSheet
        ref={dateBottomSheetRef}
        date={date.value}
        setDate={date.onChange}
        onBlurInput={() => dateInputRef.current?.blur()}
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

  categoryGrid: { flexDirection: "row", flexWrap: "wrap" },
  category: {
    width: "25%",
    justifyContent: "center",
    alignItems: "center",
    padding: 4,
    gap: 2,
  },
  categoryButton: {
    padding: 16,
    backgroundColor: theme.colors.grey4,
    borderRadius: 16,
  },
  categoryButtonActive: {
    backgroundColor: theme.colors.primary,
  },
  categoryText: {
    fontSize: 12,
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

AddBillForm.displayName = "AddBillForm";

export default memo(AddBillForm);
