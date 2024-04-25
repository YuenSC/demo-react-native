import { BottomSheetView } from "@gorhom/bottom-sheet";
import { Picker } from "@react-native-picker/picker";
import { Button, Text, makeStyles, useTheme } from "@rneui/themed";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { EdgeInsets, useSafeAreaInsets } from "react-native-safe-area-context";

import StyledBottomSheet from "@/components/common/StyledBottomSheet";
import { useAppSelector } from "@/hooks/reduxHook";
import { currentGroupSelector } from "@/store/reducers/groups";
import { CurrencyCode } from "@/types/Currency";
import { IStackScreenProps } from "@/types/navigation";

const CurrencyCodeSelectBottomSheet = ({
  navigation,
  route: {
    params: {
      selectedCurrency: externalSelectedCurrency,
      setSelectedCurrency: externalSetSelectedCurrency,
      isCurrencyNullable,
    },
  },
}: IStackScreenProps<"CurrencyCodeSelect">) => {
  const insets = useSafeAreaInsets();
  const styles = useStyles(insets);
  const { theme } = useTheme();
  const { t } = useTranslation();

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
    <StyledBottomSheet
      onClose={handleClose}
      enablePanDownToClose
      enableDynamicSizing
      snapPoints={["50%"]}
    >
      <BottomSheetView style={styles.contentContainer}>
        <Text h2>{t("CurrencyCodeSelectScreen:currency")}</Text>
        <Picker
          selectedValue={selectedCurrency}
          onValueChange={(itemValue) => setSelectedCurrency(itemValue)}
        >
          {isCurrencyNullable && (
            <Picker.Item
              label={t("CurrencyCodeSelectScreen:all")}
              value=""
              color={theme.colors.black}
              style={styles.pickerItemText}
            />
          )}
          {availableCurrencyCodes.map((code) => (
            <Picker.Item
              label={code}
              value={code}
              key={code}
              style={styles.pickerItemText}
              color={theme.colors.black}
            />
          ))}
        </Picker>
        <Button title={t("Common:done")} onPress={handleClose} />
      </BottomSheetView>
    </StyledBottomSheet>
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
  pickerItemText: {
    fontSize: 20,
    color: theme.colors.black,
    fontWeight: "bold",
  },
}));

export default CurrencyCodeSelectBottomSheet;
