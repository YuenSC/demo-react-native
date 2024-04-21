import { Text, makeStyles, useTheme } from "@rneui/themed";
import { Fragment, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { View, ScrollView } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { PieChart, pieDataItem } from "react-native-gifted-charts";
import { BannerAd, BannerAdSize } from "react-native-google-mobile-ads";
import { SafeAreaView } from "react-native-safe-area-context";

import Config from "@/Config";
import { HStack, VStack } from "@/components/common/Stack";
import { useAppSelector } from "@/hooks/reduxHook";
import { currentGroupSelector } from "@/store/reducers/groups";
import { BillCategoryEnum } from "@/types/BillCategories";
import { DataDisplayTarget } from "@/types/DataDisplayTarget";

const data: pieDataItem[] = [
  {
    value: 47,
    color: "#009FFF",
    gradientCenterColor: "#006DFF",
  },
  {
    value: 40,
    color: "#93FCF8",
    gradientCenterColor: "#3BE9DE",
  },
  {
    value: 16,
    color: "#BDB2FA",
    gradientCenterColor: "#8F80F3",
  },
  {
    value: 3,
    color: "#FFA5BA",
    gradientCenterColor: "#FF7F97",
  },
];

const StatisticScreen = () => {
  const styles = useStyles();
  const { theme } = useTheme();
  const { t } = useTranslation();

  const [target, setTarget] = useState<DataDisplayTarget>(
    DataDisplayTarget.You,
  );

  const currentGroup = useAppSelector(currentGroupSelector);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
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
        <Trans
          i18nKey="StatisticScreen:subtitle" // optional -> fallbacks to defaults if not provided
          values={{
            amount: "$1000",
          }}
          components={{
            Highlight: <Text style={styles.highlight} />,
            Text: <Text />,
          }}
        />

        <VStack>
          <View style={styles.pieChartContainer}>
            <PieChart
              data={data}
              showText
              donut
              showGradient
              radius={120}
              innerRadius={80}
              innerCircleColor={theme.colors.background}
              centerLabelComponent={() => {
                return (
                  <Text style={{ fontSize: 32, color: "white" }}>47%</Text>
                );
              }}
            />
          </View>

          <View style={styles.categoryContainer}>
            {Object.values(BillCategoryEnum).map((key, index) => {
              const isLast = index === Object.keys(BillCategoryEnum).length - 1;
              return (
                <Fragment key={key}>
                  <HStack style={styles.categoryItem}>
                    <HStack gap={8}>
                      <View style={styles.categoryDot} />
                      <Text>{t(`BillCategoryEnum:${key}`)}</Text>
                    </HStack>
                    <HStack gap={8}>
                      <Text style={styles.amount}>$100</Text>
                      <Text style={styles.percentage}>47%</Text>
                    </HStack>
                  </HStack>

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
    fontWeight: "bold",
  },
  percentage: {
    color: theme.colors.grey1,
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

export default StatisticScreen;
