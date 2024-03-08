import BottomSheet from "@gorhom/bottom-sheet";
// eslint-disable-next-line no-restricted-imports
import { Input as BaseInput } from "@rneui/base";
import { Input, Text, makeStyles } from "@rneui/themed";
import { memo, useRef, useState } from "react";
import { ScrollView, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import BillCalculatorBottomSheet from "./BillCalculatorBottomSheet";

type IAddBillFormProps = object;

const AddBillForm = memo<IAddBillFormProps>(() => {
  const insets = useSafeAreaInsets();
  const styles = useStyles(insets);

  const [amount, setAmount] = useState(0);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const inputRef = useRef<TextInput & BaseInput>(null);

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
          placeholder="Bill amount"
          showSoftInputOnFocus={false}
          value={amount === 0 ? undefined : amount.toLocaleString()}
          onFocus={() => bottomSheetRef.current?.snapToIndex(0)}
          onBlur={() => bottomSheetRef.current?.close()}
        />

        {/* Comment and Date */}
        <Input placeholder="Comment" />
        <Input placeholder="Date" />

        {/* Category */}
        <Text>Category</Text>
      </ScrollView>

      <BillCalculatorBottomSheet
        ref={bottomSheetRef}
        amount={amount}
        setAmount={setAmount}
        onBlurInput={() => inputRef.current?.blur()}
      />
    </View>
  );
});

const useStyles = makeStyles((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
}));

AddBillForm.displayName = "AddBillForm";

export default AddBillForm;
