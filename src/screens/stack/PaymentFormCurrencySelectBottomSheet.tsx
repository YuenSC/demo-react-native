import { Ionicons } from "@expo/vector-icons";
import BottomSheet, { BottomSheetSectionList } from "@gorhom/bottom-sheet";
import { SearchBar, Text, makeStyles, useTheme } from "@rneui/themed";
import { useMemo, useRef, useState } from "react";
import { Keyboard, TouchableOpacity, View } from "react-native";
import { EdgeInsets, useSafeAreaInsets } from "react-native-safe-area-context";

import StyledBottomSheet from "../../components/common/StyledBottomSheet";

import CurrencySelectTouchableOpacity from "@/components/addPayment/CurrencySelectTouchableOpacity";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHook";
import {
  addCurrencyCodeSuggestion,
  deleteCurrencyCodeSuggestion,
} from "@/store/reducers/groups";
import { currencyCodes } from "@/types/Currency";
import { IStackScreenProps } from "@/types/navigation";

const snapPoints = ["70%"];

const PaymentFormCurrencySelectBottomSheet = ({
  navigation,
  route: {
    params: { currencyCode, setCurrencyCode },
  },
}: IStackScreenProps<"PaymentFormCurrencySelectBottomSheet">) => {
  const insets = useSafeAreaInsets();
  const styles = useStyles(insets);
  const { theme } = useTheme();

  const [searchText, setSearchText] = useState("");

  const dispatch = useAppDispatch();
  const suggestedCurrencyCodes = useAppSelector(
    (state) => state.groups.suggestedCurrencyCodes ?? [],
  );

  const bottomSheetRef = useRef<BottomSheet>(null);

  const sections = useMemo(() => {
    const formattedSearchText = searchText.trim().toLowerCase();

    const allCurrencyData = Object.values(currencyCodes)
      .filter((i) => i.code !== currencyCode)
      .filter((i) => !suggestedCurrencyCodes.includes(i.code))
      .filter(
        (item) =>
          item.code.toLowerCase().includes(formattedSearchText) ||
          item.name.toLowerCase().includes(formattedSearchText),
      );

    const suggestedCurrencyData = Object.values(currencyCodes).filter((i) =>
      suggestedCurrencyCodes.includes(i.code),
    );

    if (suggestedCurrencyData.length === 0) {
      return [
        {
          title: "All Currency",
          data: allCurrencyData,
        },
      ];
    }

    return [
      {
        title: "Suggested Currency",
        data: suggestedCurrencyData,
      },
      {
        title: "All Currency",
        data: allCurrencyData,
      },
    ];
  }, [currencyCode, searchText, suggestedCurrencyCodes]);

  return (
    <StyledBottomSheet
      enablePanDownToClose
      snapPoints={snapPoints}
      ref={bottomSheetRef}
      onClose={navigation.goBack}
    >
      <View style={styles.searchBarContainer}>
        <SearchBar
          autoFocus
          platform="ios"
          value={searchText}
          onChangeText={(text) => setSearchText(text)}
          placeholder="Search currency code or name"
          containerStyle={styles.searchBar}
          searchIcon={
            <Ionicons name="search" size={20} color={theme.colors.grey3} />
          }
          clearIcon={
            <TouchableOpacity onPress={() => setSearchText("")}>
              <Ionicons name="close" size={20} color={theme.colors.grey3} />
            </TouchableOpacity>
          }
          inputStyle={styles.whiteColor}
          cancelButtonProps={styles.whiteColor}
        />

        <Text style={{ marginLeft: 8, fontSize: 20 }}>
          {`Selected: ${currencyCode}`}
        </Text>
      </View>

      <BottomSheetSectionList
        sections={sections}
        renderSectionFooter={() => <View style={{ marginVertical: 16 }} />}
        keyboardShouldPersistTaps="always"
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={styles.contentContainer}
        renderSectionHeader={({ section }) => (
          <Text style={styles.headerText}>{section.title}</Text>
        )}
        renderItem={({ item }) => {
          const isInSuggestionList = suggestedCurrencyCodes.includes(item.code);

          return (
            <CurrencySelectTouchableOpacity
              code={item.code}
              name={item.name}
              onPress={() => {
                bottomSheetRef.current?.close();
                dispatch(addCurrencyCodeSuggestion(item.code));
                Keyboard.dismiss();
                setCurrencyCode(item.code);
                setSearchText("");
              }}
              {...(isInSuggestionList
                ? {
                    onDelete: () => {
                      dispatch(deleteCurrencyCodeSuggestion(item.code));
                    },
                  }
                : {})}
            />
          );
        }}
      />
    </StyledBottomSheet>
  );
};

const useStyles = makeStyles((theme, insets: EdgeInsets) => ({
  container: {
    backgroundColor: "transparent",
  },
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
  searchBar: {
    backgroundColor: theme.colors.modal,
  },
  searchBarContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  contentContainer: {
    paddingHorizontal: 12,
    paddingBottom: insets.bottom,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "600",
    paddingLeft: 8,
    paddingBottom: 8,
    marginBottom: 8,
    backgroundColor: theme.colors.modal,
    flex: 1,
  },
  itemTextHighLight: {
    color: "black",
    backgroundColor: "yellow",
  },
  separator: {
    height: 1,
    backgroundColor: theme.colors.divider,
    marginVertical: 12,
  },
  whiteColor: {
    color: theme.colors.black,
  },
}));

PaymentFormCurrencySelectBottomSheet.displayName = "BillCalculator";

export default PaymentFormCurrencySelectBottomSheet;
