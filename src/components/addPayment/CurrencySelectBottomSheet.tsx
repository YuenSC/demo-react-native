import { AntDesign } from "@expo/vector-icons";
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetSectionList,
} from "@gorhom/bottom-sheet";
import { SearchBar, Text, makeStyles } from "@rneui/themed";
import {
  forwardRef,
  memo,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { Keyboard, TouchableOpacity, View } from "react-native";
import { EdgeInsets, useSafeAreaInsets } from "react-native-safe-area-context";

import { useAppDispatch, useAppSelector } from "@/hooks/reduxHook";
import {
  addCurrencyCodeSuggestion,
  deleteCurrencyCodeSuggestion,
} from "@/store/reducers/groups";
import { CurrencyCode, currencyCodes } from "@/types/Currency";

type ICurrencySelectBottomSheetProps = {
  currencyCode: CurrencyCode;
  setCurrencyCode: React.Dispatch<React.SetStateAction<CurrencyCode>>;
};

const snapPoints = ["95%"];

const CurrencySelectBottomSheet = forwardRef<
  BottomSheetModal,
  ICurrencySelectBottomSheetProps
>(({ currencyCode, setCurrencyCode }, outerRef) => {
  const insets = useSafeAreaInsets();
  const styles = useStyles(insets);

  const [searchText, setSearchText] = useState("");

  const dispatch = useAppDispatch();
  const suggestedCurrencyCodes = useAppSelector(
    (state) => state.groups.suggestedCurrencyCodes ?? []
  );

  const bottomSheetRef = useRef<BottomSheetModal>(null);
  useImperativeHandle(outerRef, () => bottomSheetRef.current!, []);

  const sections = useMemo(() => {
    const formattedSearchText = searchText.trim().toLowerCase();

    const allCurrencyData = Object.values(currencyCodes)
      .filter((i) => i.code !== currencyCode)
      .filter((i) => !suggestedCurrencyCodes.includes(i.code))
      .filter(
        (item) =>
          item.code.toLowerCase().includes(formattedSearchText) ||
          item.name.toLowerCase().includes(formattedSearchText)
      );

    const suggestedCurrencyData = Object.values(currencyCodes).filter((i) =>
      suggestedCurrencyCodes.includes(i.code)
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
      snapPoints={snapPoints}
      ref={bottomSheetRef}
      backdropComponent={renderBackdrop}
    >
      <View style={styles.searchBarContainer}>
        <SearchBar
          autoFocus
          platform="ios"
          value={searchText}
          onChangeText={(text) => setSearchText(text)}
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
            <CurrencyTouchableOpacity
              code={item.code}
              name={item.name}
              onPress={() => {
                bottomSheetRef.current?.dismiss();
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
    </BottomSheetModal>
  );
});

const CurrencyTouchableOpacity = ({
  onPress,
  code,
  name,
  onDelete,
}: {
  onPress: () => void;
  name: string;
  code: string;
  onDelete?: () => void;
}) => {
  const styles = useStyles();

  return (
    <TouchableOpacity style={styles.itemContainer} onPress={onPress}>
      <Text style={styles.itemName}>{name}</Text>
      <Text style={styles.itemCode}>{code}</Text>
      {onDelete && (
        <TouchableOpacity hitSlop={10} onPress={onDelete}>
          <AntDesign name="delete" size={20} />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

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
    backgroundColor: theme.colors.white,
    flex: 1,
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 16,
    gap: 12,
  },
  itemName: {
    fontSize: 18,
    flex: 1,
  },
  itemCode: {
    fontSize: 18,
    color: theme.colors.grey3,
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
}));

CurrencySelectBottomSheet.displayName = "BillCalculator";

export default memo(CurrencySelectBottomSheet);
