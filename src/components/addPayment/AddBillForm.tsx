import BottomSheet from "@gorhom/bottom-sheet";
import { Input, Text, makeStyles } from "@rneui/themed";
import { memo, useRef, useState } from "react";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import BillCalculatorBottomSheet from "./BillCalculatorBottomSheet";

type IAddBillFormProps = object;

const AddBillForm = memo<IAddBillFormProps>(() => {
  const insets = useSafeAreaInsets();
  const styles = useStyles(insets);

  const [amount, setAmount] = useState(0);
  const bottomSheetRef = useRef<BottomSheet>(null);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        style={styles.container}
        keyboardDismissMode="on-drag"
        onScrollBeginDrag={() => bottomSheetRef.current?.close()}
      >
        {/* Bill */}
        <Input
          placeholder="Bill amount"
          showSoftInputOnFocus={false}
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
