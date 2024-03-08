import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { Text, makeStyles } from "@rneui/themed";
import { forwardRef, memo, useImperativeHandle, useRef } from "react";
import { View } from "react-native";
import { EdgeInsets, useSafeAreaInsets } from "react-native-safe-area-context";

type IBillCalculatorBottomSheetProps = {
  amount: number;
  setAmount: React.Dispatch<React.SetStateAction<number>>;
};

const BillCalculatorBottomSheet = forwardRef<
  BottomSheet,
  IBillCalculatorBottomSheetProps
>(({ amount, setAmount }, outerRef) => {
  const insets = useSafeAreaInsets();
  const styles = useStyles(insets);

  const bottomSheetRef = useRef<BottomSheet>(null);

  useImperativeHandle(outerRef, () => bottomSheetRef.current!, []);

  return (
    <BottomSheet
      enablePanDownToClose
      enableDynamicSizing
      ref={bottomSheetRef}
      animateOnMount={false}
      handleComponent={() => null}
    >
      <BottomSheetView style={styles.bottomSheetContainer}>
        <View style={styles.bottomSheetInnerContainer}>
          <Text>BillCalculator</Text>
          <Text>BillCalculator</Text>
          <Text>BillCalculator</Text>
          <Text>BillCalculator</Text>
          <Text>BillCalculator</Text>
          <Text>BillCalculator</Text>
          <Text>BillCalculator</Text>
          <Text>BillCalculator</Text>
          <Text>BillCalculator</Text>
          <Text>BillCalculator</Text>
          <Text>BillCalculator</Text>
          <Text>BillCalculator</Text>
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
});

const useStyles = makeStyles((theme, insets: EdgeInsets) => ({
  bottomSheetContainer: {
    flex: 0,
    minHeight: 100,
    backgroundColor: theme.colors.grey4,
    paddingHorizontal: 10,
  },
  bottomSheetInnerContainer: {
    paddingVertical: Math.max(16, insets.bottom),
  },
}));

BillCalculatorBottomSheet.displayName = "BillCalculator";

export default memo(BillCalculatorBottomSheet);
