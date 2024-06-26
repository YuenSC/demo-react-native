import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Text, makeStyles, useTheme } from "@rneui/themed";
import { Fragment, useEffect, useMemo, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { Pressable, ScrollView, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { PieChart } from "react-native-gifted-charts";
import { BannerAd, BannerAdSize } from "react-native-google-mobile-ads";

import Config from "@/Config";
import { HStack, VStack } from "@/components/common/Stack";
import { useAppSelector } from "@/hooks/reduxHook";
import { currentGroupSelector } from "@/store/reducers/groups";
import { userSelector } from "@/store/reducers/users";
import { BillCategoryColor, BillCategoryEnum } from "@/types/BillCategories";
import { CurrencyCode } from "@/types/Currency";
import { DataDisplayTarget } from "@/types/DataDisplayTarget";
import { IBottomTabScreenProps } from "@/types/navigation";
import {
  formatAmount,
  getAvailableCurrencyCodes,
  getTotalCategoryExpenseByCurrencyCode,
  getUserTotalCategoryExpenseByCurrencyCode,
  roundAmountToDecimal,
} from "@/utils/payment";

const StatisticScreen = ({
  navigation,
}: IBottomTabScreenProps<"Statistic">) => {
  const styles = useStyles();
  const { theme } = useTheme();
  const { t } = useTranslation();

  const [target, setTarget] = useState<DataDisplayTarget>(
    DataDisplayTarget.You,
  );
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyCode | null>(
    null,
  );

  const currentGroup = useAppSelector(currentGroupSelector);
  const profileUserId = useAppSelector((state) => state.profile.userId);
  const profileUser = useAppSelector((state) =>
    userSelector(state, profileUserId),
  );
  const availableCurrencyCodes = getAvailableCurrencyCodes(
    currentGroup?.paymentRecords ?? [],
  );
  const hasMoreThanOneCurrency = useMemo(() => {
    if (!currentGroup) return false;

    return (
      new Set(currentGroup.paymentRecords.map((item) => item.currencyCode))
        .size > 1
    );
  }, [currentGroup]);

  const {
    amountText,
    categoryExpense,
    pieData,
    totalAmount,
    totalExpenseByCurrency,
  } = useMemo(() => {
    const totalCategoryExpenseByCurrencyCode =
      getTotalCategoryExpenseByCurrencyCode(currentGroup?.paymentRecords ?? []);

    const userTotalCategoryExpenseByCurrencyCode =
      getUserTotalCategoryExpenseByCurrencyCode(
        profileUserId || "",
        currentGroup?.paymentRecords ?? [],
      );

    const categoryExpenseByCurrency =
      target === DataDisplayTarget.Group
        ? totalCategoryExpenseByCurrencyCode
        : userTotalCategoryExpenseByCurrencyCode;

    const categoryExpense = selectedCurrency
      ? categoryExpenseByCurrency[selectedCurrency]
      : ({} as Record<BillCategoryEnum, number>);

    const pieData = Object.entries(categoryExpense)
      .sort(([category1, value1], [category2, value2]) => value2 - value1)
      .map(([category, value]) => {
        return {
          value,
          color: BillCategoryColor[category as BillCategoryEnum],
          gradientCenterColor: BillCategoryColor[category as BillCategoryEnum],
        };
      });
    const totalAmount = Object.values(categoryExpense).reduce(
      (acc, curr) => acc + curr,
      0,
    );
    const totalExpenseByCurrency = Object.entries(categoryExpenseByCurrency)
      .map(([code, categoryExpense]) => {
        const amount = Object.values(categoryExpense).reduce(
          (acc, curr) => acc + curr,
          0,
        );
        return { code, amount };
      })
      .reduce(
        (acc, { amount, code }) => ({
          ...acc,
          [code]: amount,
        }),
        {} as Record<CurrencyCode, number>,
      );

    return {
      pieData,
      categoryExpense,
      totalAmount,
      totalExpenseByCurrency,
      amountText: Object.entries(totalExpenseByCurrency)
        .map(([code, totalExpense]) => {
          return formatAmount(totalExpense, code as CurrencyCode);
        })
        .join(" / "),
    };
  }, [currentGroup?.paymentRecords, profileUserId, selectedCurrency, target]);

  useEffect(() => {
    if (!selectedCurrency && availableCurrencyCodes[0]) {
      setSelectedCurrency(availableCurrencyCodes[0]);
    }
  }, [availableCurrencyCodes, selectedCurrency]);

  if (!selectedCurrency) return null;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <HStack>
          <HStack justifyContent="flex-start">
            <Text h1>{t("StatisticScreen:statistics")}</Text>
            <TouchableOpacity
              style={styles.toggleTarget}
              onPress={() =>
                setTarget(
                  target === DataDisplayTarget.Group
                    ? DataDisplayTarget.You
                    : DataDisplayTarget.Group,
                )
              }
            >
              <Text style={styles.toggleTargetText}>
                {target === DataDisplayTarget.Group
                  ? t("Common:groupLabel")
                  : t("Common:profileUserLabel")}
              </Text>
            </TouchableOpacity>
          </HStack>

          {hasMoreThanOneCurrency && (
            <TouchableOpacity
              hitSlop={8}
              onPress={() =>
                navigation.navigate("CurrencyCodeSelect", {
                  setSelectedCurrency,
                  selectedCurrency,
                  isCurrencyNullable: false,
                })
              }
            >
              <HStack gap={4}>
                <Text style={styles.selectedCurrency}>{selectedCurrency}</Text>
                <MaterialCommunityIcons
                  name="filter"
                  size={24}
                  color={theme.colors.primary}
                />
              </HStack>
            </TouchableOpacity>
          )}
        </HStack>
        <Trans
          i18nKey="StatisticScreen:subtitle" // optional -> fallbacks to defaults if not provided
          values={{
            amount: amountText,
            name:
              target === DataDisplayTarget.Group
                ? currentGroup?.name
                : profileUser?.name,
          }}
          components={{
            Highlight: <Text style={styles.highlight} />,
            Text: <Text />,
          }}
        />

        <VStack>
          <View style={styles.pieChartContainer}>
            <PieChart
              data={pieData}
              showText
              donut
              showGradient
              radius={120}
              innerRadius={80}
              innerCircleColor={theme.colors.background}
              centerLabelComponent={() => {
                if (!selectedCurrency) return null;
                return (
                  <Text h4 style={{ textAlign: "center" }}>
                    {formatAmount(
                      totalExpenseByCurrency[selectedCurrency],
                      selectedCurrency,
                    )}
                  </Text>
                );
              }}
            />
          </View>

          <View style={styles.categoryContainer}>
            {Object.values(BillCategoryEnum)
              .sort((cat1, cat2) =>
                (categoryExpense[cat1] ?? 0) > (categoryExpense[cat2] ?? 0)
                  ? -1
                  : 1,
              )
              .map((key, index) => {
                const isLast =
                  index === Object.keys(BillCategoryEnum).length - 1;
                return (
                  <Fragment key={key}>
                    <Pressable>
                      <HStack style={styles.categoryItem}>
                        <HStack gap={8}>
                          <View
                            style={[
                              styles.categoryDot,
                              { backgroundColor: BillCategoryColor[key] },
                            ]}
                          />
                          <Text>{t(`BillCategoryEnum:${key}`)}</Text>
                        </HStack>
                        <HStack gap={8}>
                          <Text style={styles.amount}>
                            {formatAmount(
                              categoryExpense[key] ?? 0,
                              selectedCurrency,
                            )}
                          </Text>
                          <Text style={styles.percentage}>
                            {`${roundAmountToDecimal(((categoryExpense[key] ?? 0) * 100) / totalAmount, 1)}%`}
                          </Text>
                        </HStack>
                      </HStack>
                    </Pressable>

                    {isLast ? null : <View style={styles.divider} />}
                  </Fragment>
                );
              })}
          </View>
        </VStack>
      </ScrollView>
      <BannerAd
        unitId={Config.adBannerUnitId}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
      />
    </View>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  contentContainer: {
    padding: 16,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
  },
  highlight: {
    fontWeight: "bold",
    color: theme.colors.primary,
  },
  pieChartContainer: {
    marginVertical: 32,
  },
  categoryContainer: {
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: theme.colors.divider,
    alignSelf: "stretch",
  },
  categoryDot: {
    backgroundColor: theme.colors.primary,
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  categoryItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.divider,
    marginHorizontal: 16,
  },
  amount: {
    // fontWeight: "bold",
  },
  percentage: {
    color: theme.colors.grey1,
    minWidth: 48,
    textAlign: "right",
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
  selectedCurrency: {
    color: theme.colors.primary,
    fontWeight: "bold",
  },
}));

export default StatisticScreen;
