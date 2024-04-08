import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import DateTimePicker from "@react-native-community/datetimepicker";
import { makeStyles, useTheme } from "@rneui/themed";
import { useRef } from "react";
import { View } from "react-native";
import { EdgeInsets, useSafeAreaInsets } from "react-native-safe-area-context";

import StyledBottomSheet from "../../components/common/StyledBottomSheet";

import { IStackScreenProps } from "@/types/navigation";

const PaymentFormDatePickerBottomSheet = ({
  navigation,
  route: {
    params: { date, setDate },
  },
}: IStackScreenProps<"PaymentFormDatePickerBottomSheet">) => {
  const insets = useSafeAreaInsets();
  const styles = useStyles(insets);
  const { theme } = useTheme();

  const bottomSheetRef = useRef<BottomSheet>(null);

  return (
    <StyledBottomSheet
      enablePanDownToClose
      enableDynamicSizing
      ref={bottomSheetRef}
      onClose={navigation.goBack}
    >
      <BottomSheetView style={styles.bottomSheetContainer}>
        <View style={styles.bottomSheetInnerContainer}>
          <DateTimePicker
            value={new Date(date)}
            mode="datetime"
            display="spinner"
            onChange={(event, date) => date && setDate(date.toISOString())}
            textColor={theme.colors.black}
          />
        </View>
      </BottomSheetView>
    </StyledBottomSheet>
  );
};

const useStyles = makeStyles((theme, insets: EdgeInsets) => ({
  bottomSheetContainer: {
    flex: 0,
    minHeight: 100,
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

PaymentFormDatePickerBottomSheet.displayName = "BillCalculator";

export default PaymentFormDatePickerBottomSheet;
