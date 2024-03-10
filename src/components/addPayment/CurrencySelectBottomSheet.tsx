import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { Text, makeStyles } from "@rneui/themed";
import {
  forwardRef,
  memo,
  useCallback,
  useImperativeHandle,
  useRef,
} from "react";
import { View } from "react-native";
import { EdgeInsets, useSafeAreaInsets } from "react-native-safe-area-context";

import { CurrencyCode } from "@/types/Currency";

type ICurrencySelectBottomSheetProps = {
  currencyCode: CurrencyCode;
  setCurrencyCode: React.Dispatch<React.SetStateAction<CurrencyCode>>;
};

const CurrencySelectBottomSheet = forwardRef<
  BottomSheetModal,
  ICurrencySelectBottomSheetProps
>(({ currencyCode, setCurrencyCode }, outerRef) => {
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
    []
  );
  return (
    <BottomSheetModal
      enablePanDownToClose
      enableDynamicSizing
      ref={bottomSheetRef}
      handleComponent={() => null}
      backdropComponent={renderBackdrop}
    >
      <BottomSheetView style={styles.bottomSheetContainer}>
        <View style={styles.bottomSheetInnerContainer}>
          <Text>1234</Text>
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

CurrencySelectBottomSheet.displayName = "BillCalculator";

export default memo(CurrencySelectBottomSheet);
