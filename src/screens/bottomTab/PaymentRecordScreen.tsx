import {
  AntDesign,
  FontAwesome,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { Text, makeStyles, useTheme } from "@rneui/themed";
import { useMemo, useState } from "react";
import { FlatList, TouchableOpacity } from "react-native";

import BillCategoryIcon from "@/components/BillCategoryIcon";
import HStack from "@/components/common/HStack";
import VStack from "@/components/common/VStack";
import { useAppSelector } from "@/hooks/reduxHook";
import { currentGroupSelector } from "@/store/reducers/groups";
import { BillCategoryEnum } from "@/types/BillCategories";
import { CurrencyCode } from "@/types/Currency";
import { SortDirectionEnum } from "@/types/SortDirectionEnum";
import { IBottomTabScreenProps } from "@/types/navigation";
import { formatDate } from "@/utils/formatDate";

const PaymentRecordScreen = ({
  navigation,
  route,
}: IBottomTabScreenProps<"PaymentRecord">) => {
  const styles = useStyles();
  const currentGroup = useAppSelector(currentGroupSelector);
  const { theme } = useTheme();
  const [sortDirection, setSortDirection] = useState(SortDirectionEnum.DESC);
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyCode | null>(
    null,
  );

  const paymentRecordsFormatted = useMemo(() => {
    if (!currentGroup) {
      return [];
    }

    return currentGroup.paymentRecords
      .filter(
        (item) => !selectedCurrency || item.currencyCode === selectedCurrency,
      )
      .sort((a, b) => {
        const date1Time = new Date(a.date).getTime();
        const date2Time = new Date(b.date).getTime();

        return sortDirection === SortDirectionEnum.ASC
          ? date1Time - date2Time
          : date2Time - date1Time;
      });
  }, [currentGroup, selectedCurrency, sortDirection]);

  if (!currentGroup) {
    return null;
  }

  return (
    <FlatList
      data={paymentRecordsFormatted}
      style={styles.container}
      ListHeaderComponent={() => (
        <HStack>
          <Text h1>Payments</Text>
          <HStack gap={12}>
            <TouchableOpacity
              hitSlop={8}
              onPress={() =>
                navigation.navigate("PaymentRecordFilter", {
                  setSelectedCurrency,
                  selectedCurrency,
                })
              }
            >
              <MaterialCommunityIcons
                name={selectedCurrency ? "filter-remove" : "filter"}
                size={24}
                color={theme.colors.primary}
              />
            </TouchableOpacity>
            <TouchableOpacity
              hitSlop={8}
              onPress={() => {
                setSortDirection(
                  sortDirection === SortDirectionEnum.ASC
                    ? SortDirectionEnum.DESC
                    : SortDirectionEnum.ASC,
                );
              }}
            >
              <FontAwesome
                name={
                  sortDirection === SortDirectionEnum.ASC
                    ? "sort-amount-asc"
                    : "sort-amount-desc"
                }
                size={20}
                color={theme.colors.primary}
              />
            </TouchableOpacity>
          </HStack>
        </HStack>
      )}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.contentContainerStyle}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.item}
          onPress={() =>
            navigation.navigate("EditPayment", {
              groupId: currentGroup.id,
              recordId: item.id,
            })
          }
        >
          <VStack gap={4} style={{ flex: 1 }}>
            <HStack gap={4} justifyContent="flex-start">
              <BillCategoryIcon category={item.category as BillCategoryEnum} />
              <Text>{formatDate(item.date)}</Text>
            </HStack>

            <Text numberOfLines={1}>{item.comment}</Text>
          </VStack>
          <Text style={styles.amount} numberOfLines={1}>
            {`${item.currencyCode}${item.amount.toLocaleString()}`}
          </Text>
        </TouchableOpacity>
      )}
    />
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  contentContainerStyle: {
    padding: 16,
    gap: 8,
  },
  item: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.divider,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  amount: {
    fontWeight: "bold",
    maxWidth: 100,
  },
}));

export default PaymentRecordScreen;
