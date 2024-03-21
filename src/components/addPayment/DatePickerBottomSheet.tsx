import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import DateTimePicker from "@react-native-community/datetimepicker";
import { makeStyles } from "@rneui/themed";
import {
  forwardRef,
  memo,
  useCallback,
  useImperativeHandle,
  useRef,
} from "react";
import { View } from "react-native";
import { EdgeInsets, useSafeAreaInsets } from "react-native-safe-area-context";

type IDatePickerBottomSheetProps = {
  date: string;
  setDate: React.Dispatch<React.SetStateAction<string>>;
  onBlurInput: () => void;
};

const DatePickerBottomSheet = forwardRef<
  BottomSheetModal,
  IDatePickerBottomSheetProps
>(({ date, setDate, onBlurInput }, outerRef) => {
  const insets = useSafeAreaInsets();
  const styles = useStyles(insets);

  const bottomSheetRef = useRef<BottomSheetModal>(null);
  useImperativeHandle(outerRef, () => bottomSheetRef.current!, []);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        style={styles.bottomSheetBackdrop}
      />
    ),
    [styles.bottomSheetBackdrop]
  );

  return (
    <BottomSheetModal
      enablePanDownToClose
      enableDynamicSizing
      ref={bottomSheetRef}
      handleComponent={() => null}
      backdropComponent={renderBackdrop}
      onDismiss={onBlurInput}
    >
      <BottomSheetView style={styles.bottomSheetContainer}>
        <View style={styles.bottomSheetInnerContainer}>
          <DateTimePicker
            value={new Date(date)}
            mode="datetime"
            display="spinner"
            onChange={(event, date) => date && setDate(date.toISOString())}
          />
        </View>
      </BottomSheetView>
    </BottomSheetModal>
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
  bottomSheetBackdrop: {
    backgroundColor: theme.colors.grey1,
    position: "absolute",
    top: 0,
    width: "100%",
    height: "100%",
  },
}));

DatePickerBottomSheet.displayName = "BillCalculator";

export default memo(DatePickerBottomSheet);
