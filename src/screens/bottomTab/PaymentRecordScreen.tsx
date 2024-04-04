import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import { Text, makeStyles, useTheme } from "@rneui/themed";
import AnimatedLottieView from "lottie-react-native";
import { useMemo, useState } from "react";
import { FlatList, TouchableOpacity, View } from "react-native";

import BillCategoryIcon from "@/components/BillCategoryIcon";
import { HStack, VStack } from "@/components/common/Stack";
import { useAppSelector } from "@/hooks/reduxHook";
import { currentGroupSelector } from "@/store/reducers/groups";
import { BillCategoryEnum } from "@/types/BillCategories";
import { CurrencyCode, currencyCodes } from "@/types/Currency";
import { SortDirectionEnum } from "@/types/SortDirectionEnum";
import { IBottomTabScreenProps } from "@/types/navigation";
import { formatDate } from "@/utils/formatDate";
import { formatAmount, getRelatedAmount } from "@/utils/payment";

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
  const userId = useAppSelector((state) => state.profile.id);
  const hasMoreThanOneCurrency = useMemo(() => {
    if (!currentGroup) {
      return false;
    }

    return (
      new Set(currentGroup.paymentRecords.map((item) => item.currencyCode))
        .size > 1
    );
  }, [currentGroup]);

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
      ListEmptyComponent={() => {
        return (
          <View style={styles.emptyContainer}>
            <AnimatedLottieView
              autoPlay
              style={styles.lottie}
              source={require("@/assets/lottie/empty.json")}
            />

            <Text style={styles.emptyText}>
              {selectedCurrency
                ? `No payment records found for ${selectedCurrency}`
                : "No payment records found"}
            </Text>
          </View>
        );
      }}
      ListHeaderComponent={() => (
        <HStack>
          <Text h1>Payments</Text>
          <HStack gap={12}>
            {hasMoreThanOneCurrency && (
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
            )}
            {paymentRecordsFormatted.length > 0 && (
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
            )}
          </HStack>
        </HStack>
      )}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.contentContainerStyle}
      renderItem={({ item }) => {
        const record = getRelatedAmount(userId, item);
        const netAmountSign = Math.sign(record?.netAmount ?? 0);

        if (!record) return null;

        return (
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
                <BillCategoryIcon
                  category={item.category as BillCategoryEnum}
                />
                <Text>{formatDate(item.date)}</Text>
              </HStack>

              <Text numberOfLines={1}>{item.comment}</Text>
            </VStack>
            <Text
              style={[
                styles.amount,
                netAmountSign === 1 && { color: theme.colors.success },
                netAmountSign === -1 && { color: theme.colors.error },
              ]}
              numberOfLines={1}
            >
              {formatAmount(record.netAmount, record?.currencyCode)}
            </Text>
          </TouchableOpacity>
        );
      }}
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
  lottie: {
    width: "100%",
    aspectRatio: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: theme.colors.background,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 16,
  },
}));

export default PaymentRecordScreen;
