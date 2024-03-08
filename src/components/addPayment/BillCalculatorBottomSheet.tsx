import { Feather } from "@expo/vector-icons";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { Text, makeStyles } from "@rneui/themed";
import * as Haptics from "expo-haptics";
import {
  forwardRef,
  memo,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { Pressable, TouchableOpacity, Vibration, View } from "react-native";
import { EdgeInsets, useSafeAreaInsets } from "react-native-safe-area-context";
enum CalculatorOperands {
  plus = "+",
  minus = "-",
  multiply = "×",
  divide = "÷",
  dot = ".",
  clearEntry = "CE",
}

type CalculatorRecord = {
  num: string;
  sign?:
    | CalculatorOperands.divide
    | CalculatorOperands.multiply
    | CalculatorOperands.minus
    | CalculatorOperands.plus;
};

const buttonValues = [
  ["7", "8", "9", CalculatorOperands.divide],
  ["4", "5", "6", CalculatorOperands.multiply],
  ["1", "2", "3", CalculatorOperands.minus],
  [
    CalculatorOperands.dot,
    "0",
    CalculatorOperands.clearEntry,
    CalculatorOperands.plus,
  ],
];

type IBillCalculatorBottomSheetProps = {
  amount: number;
  setAmount: React.Dispatch<React.SetStateAction<number>>;
  onBlurInput: () => void;
};

const BillCalculatorBottomSheet = forwardRef<
  BottomSheet,
  IBillCalculatorBottomSheetProps
>(({ amount, setAmount, onBlurInput }, outerRef) => {
  const insets = useSafeAreaInsets();
  const styles = useStyles(insets);

  const bottomSheetRef = useRef<BottomSheet>(null);
  useImperativeHandle(outerRef, () => bottomSheetRef.current!, []);

  const [records, setRecords] = useState<CalculatorRecord[]>(
    amount ? [{ num: amount.toString() }] : []
  );

  const calculationResult = useMemo(() => {
    const formattedRecords = [
      { num: "0", sign: CalculatorOperands.plus },
      ...records,
    ];

    const result = formattedRecords.reduce((prev, { sign }, index) => {
      const nextRecord = formattedRecords[index + 1];
      if (!nextRecord) return prev;

      let temp = prev;
      switch (sign) {
        case CalculatorOperands.plus:
          temp = temp + Number(nextRecord.num);
          break;
        case CalculatorOperands.minus:
          temp = temp - Number(nextRecord.num);
          break;
        case CalculatorOperands.multiply:
          temp = temp * Number(nextRecord.num);
          break;
        case CalculatorOperands.divide:
          temp = temp / Number(nextRecord.num);
          break;
      }
      return parseFloat(temp.toFixed(2));
    }, 0);

    setAmount(result);
    return result;
  }, [records, setAmount]);

  const calculationStepText = useMemo(() => {
    const steps = records
      .map(({ num, sign }, index) => {
        const isLast = index === records.length - 1;
        return sign ? `${num} ${sign}${isLast ? " 🌚" : ""}` : num;
      })
      .join(" ");

    const result = records.length > 1 ? ` = ${calculationResult}` : "";

    const fullText = steps + result;

    return fullText ? fullText : "Enter something~";
  }, [calculationResult, records]);

  const onNumberClick = async (key: string) => {
    const recordCopy = [...records];
    const lastRecord = recordCopy[records.length - 1];

    // Case 1: Start typing the first number -> !lastRecord
    // Case 2: Typed n-th number and n-th sign -> lastRecord.sign is some string
    if (!lastRecord || Boolean(lastRecord?.sign)) {
      if (key === "0") {
        return;
      }
      setRecords([...recordCopy, { num: key, sign: undefined }]);
      return;
    }

    // Case 3: Current decimal place is more than two
    if (
      lastRecord.num.includes(".") &&
      lastRecord.num.split(".")[1].length >= 2
    ) {
      Vibration.vibrate();
      return;
    }

    // Case 4: Current num is larger than 100000
    if (Number(lastRecord.num + key) > 1_000_000) {
      Vibration.vibrate();
      return;
    }

    // Else Case: Entering number
    lastRecord.num = lastRecord.num + key;
    setRecords(recordCopy);
  };

  const onDotClick = () => {
    const recordCopy = [...records];
    const lastRecord = recordCopy[records.length - 1];

    if (lastRecord.num.includes(".")) return;

    lastRecord.num = lastRecord.num + ".";
    setRecords(recordCopy);
  };

  const onMathSignClick = (
    key:
      | CalculatorOperands.divide
      | CalculatorOperands.multiply
      | CalculatorOperands.minus
      | CalculatorOperands.plus
  ) => {
    const recordCopy = [...records];
    const lastRecord = recordCopy[records.length - 1];

    if (!lastRecord) return;
    if (!lastRecord.num) return;

    lastRecord.sign = key;
    setRecords(recordCopy);
  };

  const onClearEntry = () => {
    const recordCopy = [...records];
    const lastRecord = recordCopy[records.length - 1];

    if (!lastRecord) return;

    if (lastRecord?.sign) {
      lastRecord.sign = undefined;
    } else {
      if (lastRecord.num.length > 1) {
        lastRecord.num = lastRecord.num.slice(0, lastRecord.num.length - 1);
      } else {
        recordCopy.pop();
      }
    }

    setRecords(recordCopy);
  };

  const onAllClear = () => {
    setRecords([]);
    setAmount(0);
  };

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
            <Text style={styles.calculatorResultText}>
              {calculationStepText}
            </Text>
            <TouchableOpacity
              onPress={() => {
                bottomSheetRef.current?.close();
                onBlurInput();
              }}
            >
              <Text style={styles.calculatorResultDone}>Done</Text>
            </TouchableOpacity>
          </View>
          {buttonValues.map((row, index) => (
            <View key={index} style={styles.buttonRow}>
              {row.map((key) => (
                <Pressable
                  key={key}
                  style={({ pressed }) => [
                    styles.calculatorButton,
                    pressed && styles.calculatorButtonPressed,
                  ]}
                  onLongPress={() => {
                    if (key === CalculatorOperands.clearEntry) {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                      onAllClear();
                    }
                  }}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

                    switch (key) {
                      case CalculatorOperands.clearEntry:
                        onClearEntry();
                        break;
                      case CalculatorOperands.dot:
                        onDotClick();
                        break;
                      case CalculatorOperands.plus:
                      case CalculatorOperands.minus:
                      case CalculatorOperands.divide:
                      case CalculatorOperands.multiply:
                        onMathSignClick(key);
                        break;
                      default:
                        onNumberClick(key);
                    }
                  }}
                >
                  {key === CalculatorOperands.clearEntry ? (
                    <Feather name="delete" color="white" size={25} />
                  ) : (
                    <Text style={styles.calculatorButtonText}>{key}</Text>
                  )}
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
    flexDirection: "row",
    alignItems: "center",
  },
  calculatorResultText: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: "500",
    flex: 1,
  },
  calculatorResultDone: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: "700",
    paddingVertical: 4,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 10,
    justifyContent: "space-evenly",
    paddingHorizontal: "5%",
  },
  calculatorButton: {
    width: "17%",
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
