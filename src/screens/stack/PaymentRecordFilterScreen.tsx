import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { Picker } from "@react-native-picker/picker";
import { Button, makeStyles, useTheme } from "@rneui/themed";
import { useCallback, useMemo, useState } from "react";
import { View } from "react-native";
import { EdgeInsets, useSafeAreaInsets } from "react-native-safe-area-context";

import { useAppSelector } from "@/hooks/reduxHook";
import { currentGroupSelector } from "@/store/reducers/groups";
import { CurrencyCode } from "@/types/Currency";
import { IStackScreenProps } from "@/types/navigation";

const PaymentRecordFilterScreen = ({
  navigation,
  route: {
    params: {
      selectedCurrency: externalSelectedCurrency,
      setSelectedCurrency: externalSetSelectedCurrency,
    },
  },
}: IStackScreenProps<"PaymentRecordFilter">) => {
  const insets = useSafeAreaInsets();
  const styles = useStyles(insets);
  const currentGroup = useAppSelector(currentGroupSelector);
  const availableCurrencyCodes = useMemo(() => {
    const codes = currentGroup?.paymentRecords.map(
      (record) => record.currencyCode,
    );

    return codes ? [...new Set(codes)] : [];
  }, [currentGroup?.paymentRecords]);
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyCode | null>(
    externalSelectedCurrency,
  );

  const handleClose = useCallback(() => {
    externalSetSelectedCurrency(selectedCurrency);
    navigation.goBack();
  }, [selectedCurrency, externalSetSelectedCurrency, navigation]);

  if (!currentGroup) return null;

  return (
    <View style={styles.container}>
      <BottomSheet
        onClose={handleClose}
        enablePanDownToClose
        enableDynamicSizing
        snapPoints={["50%"]}
      >
        <BottomSheetView style={styles.contentContainer}>
          <Picker
            selectedValue={selectedCurrency}
            onValueChange={(itemValue, itemIndex) => {
              console.log("itemValue", itemValue);
              setSelectedCurrency(itemValue);
            }}
          >
            <Picker.Item label="All" value="" />
            {availableCurrencyCodes.map((code) => (
              <Picker.Item label={code} value={code} key={code} />
            ))}
          </Picker>
          <Button title="Close" onPress={handleClose} />
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
};

const useStyles = makeStyles((theme, insets: EdgeInsets) => ({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: theme.colors.backdrop,
  },
  contentContainer: {
    flex: 0,
    minHeight: 100,
    paddingHorizontal: 24,
    gap: 10,
    paddingBottom: insets.bottom,
  },
  itemText: {
    fontSize: 20,
  },
}));

export default PaymentRecordFilterScreen;
