import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { Text, makeStyles } from "@rneui/themed";
import { forwardRef, memo, useImperativeHandle, useRef } from "react";
import { Pressable, TouchableOpacity, View } from "react-native";
import { EdgeInsets, useSafeAreaInsets } from "react-native-safe-area-context";

const buttonValues = [
  [7, 8, 9, "÷"],
  [4, 5, 6, "×"],
  [1, 2, 3, "-"],
  [".", 0, "AC", "+"],
];

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
          <View style={styles.calculatorResultRow}>
            <Text style={styles.calculatorResultText}>6 + 6</Text>
          </View>
          {buttonValues.map((row, index) => (
            <View key={index} style={styles.buttonRow}>
              {row.map((item) => (
                <Pressable
                  key={item}
                  style={({ pressed }) => [
                    styles.calculatorButton,
                    pressed && styles.calculatorButtonPressed,
                  ]}
                >
                  <Text style={styles.calculatorButtonText}>{item}</Text>
                </Pressable>
              ))}
            </View>
          ))}
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
});

const useStyles = makeStyles((theme, insets: EdgeInsets) => ({
  bottomSheetContainer: {
    flex: 0,
    minHeight: 100,
    borderTopWidth: 1,
    borderTopColor: theme.colors.divider,
  },
  bottomSheetInnerContainer: {
    paddingBottom: Math.max(16, insets.bottom),
    gap: 10,
  },
  calculatorResultRow: {
    backgroundColor: theme.colors.primary,
    padding: 8,
    paddingHorizontal: 16,
  },
  calculatorResultText: {
    color: theme.colors.white,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 10,
    justifyContent: "space-evenly",
  },
  calculatorButton: {
    width: "15%",
    aspectRatio: 1,
    borderRadius: 9999,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.secondary,
  },
  calculatorButtonPressed: {
    backgroundColor: theme.colors.grey4,
    opacity: 0.5,
  },
  calculatorButtonText: {
    fontSize: 20,
    color: theme.colors.white,
    fontWeight: "700",
  },
}));

BillCalculatorBottomSheet.displayName = "BillCalculator";

export default memo(BillCalculatorBottomSheet);
