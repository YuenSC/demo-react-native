import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import { Text, makeStyles, useTheme } from "@rneui/themed";
import AnimatedLottieView from "lottie-react-native";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, TouchableOpacity, View } from "react-native";

import PaymentRecordDisplay from "@/components/PaymentRecordDisplay";
import { HStack, VStack } from "@/components/common/Stack";
import PaymentCalendar from "@/components/paymentRecordList/PaymentCalendar";
import { useAppSelector } from "@/hooks/reduxHook";
import { currentGroupSelector } from "@/store/reducers/groups";
import { CurrencyCode } from "@/types/Currency";
import { SortDirectionEnum } from "@/types/SortDirectionEnum";
import { IBottomTabScreenProps } from "@/types/navigation";

export enum PaymentRecordListTarget {
  You = "You",
  Group = "Group",
}

export enum PaymentRecordListMode {
  list = "list",
  calendar = "calendar",
}

const PaymentRecordListScreen = ({
  navigation,
}: IBottomTabScreenProps<"PaymentRecordList">) => {
  const styles = useStyles();
  const { t } = useTranslation();
  const currentGroup = useAppSelector(currentGroupSelector);
  const { theme } = useTheme();
  const [sortDirection, setSortDirection] = useState(SortDirectionEnum.DESC);
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyCode | null>(
    null,
  );

  const [mode, setMode] = useState<PaymentRecordListMode>(
    PaymentRecordListMode.list,
  );
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [target, setTarget] = useState<PaymentRecordListTarget>(
    PaymentRecordListTarget.You,
  );
  const userId = useAppSelector((state) => state.profile.userId);
  const hasMoreThanOneCurrency = useMemo(() => {
    if (!currentGroup) {
      return false;
    }

    return (
      new Set(currentGroup.paymentRecords.map((item) => item.currencyCode))
        .size > 1
    );
  }, [currentGroup]);

  const { data, paymentRecords } = useMemo(() => {
    if (!currentGroup) {
      return { paymentRecords: [], data: [] };
    }

    const paymentRecords = currentGroup.paymentRecords
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

    const paymentRecordsByDate = paymentRecords.filter(
      (item) =>
        new Date(item.date).toISOString().split("T")[0] ===
        selectedDate.toISOString().split("T")[0],
    );

    return {
      data:
        mode === PaymentRecordListMode.list
          ? paymentRecords
          : paymentRecordsByDate,
      paymentRecords,
    };
  }, [currentGroup, mode, selectedCurrency, selectedDate, sortDirection]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={{ marginRight: 12 }}
          onPress={() =>
            setMode(
              mode === PaymentRecordListMode.list
                ? PaymentRecordListMode.calendar
                : PaymentRecordListMode.list,
            )
          }
        >
          <MaterialCommunityIcons
            name={
              mode === PaymentRecordListMode.list
                ? "format-list-bulleted"
                : "calendar"
            }
            size={24}
            color={theme.colors.primary}
          />
        </TouchableOpacity>
      ),
    });
  }, [mode, navigation, theme.colors.primary]);

  return (
    <FlatList
      data={data}
      style={styles.container}
      ListEmptyComponent={() => {
        return (
          <View style={styles.emptyContainer}>
            <AnimatedLottieView
              autoPlay
              style={[
                styles.lottie,
                mode === PaymentRecordListMode.calendar && styles.lottieSmall,
              ]}
              source={require("@/assets/lottie/empty.json")}
            />

            <Text style={styles.emptyText}>
              {selectedCurrency
                ? t(
                    "PaymentRecordListScreen:no-payment-records-found-for-currency",
                    { currency: selectedCurrency },
                  )
                : t("PaymentRecordListScreen:no-payment-records-found")}
            </Text>
          </View>
        );
      }}
      ListHeaderComponent={() => (
        <VStack alignItems="stretch" gap={8}>
          <HStack>
            <HStack>
              <Text h1>{t("PaymentRecordListScreen:payments")}</Text>
              <TouchableOpacity
                style={styles.toggleTarget}
                onPress={() =>
                  setTarget(
                    target === PaymentRecordListTarget.Group
                      ? PaymentRecordListTarget.You
                      : PaymentRecordListTarget.Group,
                  )
                }
              >
                <Text style={styles.toggleTargetText}>
                  {target === PaymentRecordListTarget.Group
                    ? t("Common:groupLabel")
                    : t("Common:profileUserLabel")}
                </Text>
              </TouchableOpacity>
            </HStack>
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
              {data.length > 0 && (
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

          {mode === PaymentRecordListMode.calendar && (
            <PaymentCalendar
              date={selectedDate}
              onDateChange={setSelectedDate}
              records={paymentRecords}
            />
          )}
        </VStack>
      )}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.contentContainerStyle}
      renderItem={({ item }) => {
        if (!userId) return null;
        if (!currentGroup?.id) return null;

        return (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("EditPaymentModal", {
                groupId: currentGroup.id,
                recordId: item.id,
              })
            }
          >
            <PaymentRecordDisplay
              record={item}
              userId={userId}
              paymentTarget={target}
            />
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
  lottie: {
    width: "100%",
    aspectRatio: 1,
  },
  lottieSmall: {
    width: "50%",
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
  toggleTarget: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: theme.colors.primary,
    borderRadius: 16,
    marginLeft: 4,
    marginTop: 8,
  },
  toggleTargetText: {
    color: theme.colors.white,
  },
}));

export default PaymentRecordListScreen;
