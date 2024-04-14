import { AntDesign } from "@expo/vector-icons";
import { useHeaderHeight } from "@react-navigation/elements";
import { Button, Text, makeStyles, useTheme } from "@rneui/themed";
import AnimatedLottieView from "lottie-react-native";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { BannerAd, BannerAdSize } from "react-native-google-mobile-ads";

import Config from "@/Config";
import { HStack } from "@/components/common/Stack";
import GroupDetailSummaryCarousel from "@/components/groupDetail/GroupDetailSummaryCarousel";
import { useAppSelector } from "@/hooks/reduxHook";
import { currentGroupSelector } from "@/store/reducers/groups";
import { groupUsersSelector } from "@/store/reducers/users";
import { CurrencyCode } from "@/types/Currency";
import { IBottomTabScreenProps } from "@/types/navigation";
import {
  formatAmount,
  getTotalNetAmount as getTotalNetAmountByCurrency,
} from "@/utils/payment";

const GroupDetailScreen = ({
  navigation,
}: IBottomTabScreenProps<"GroupDetail">) => {
  const { t } = useTranslation();
  const styles = useStyles();
  const headerHeight = useHeaderHeight();
  const { theme } = useTheme();
  const currentGroup = useAppSelector(currentGroupSelector);
  const groupUsers = useAppSelector((state) =>
    groupUsersSelector(state, currentGroup?.id ?? ""),
  );
  const profile = useAppSelector((state) => state.profile);

  const { totalNetAmountByCurrency, hasUnresolvedExpenses } = useMemo(() => {
    if (!currentGroup || !profile.userId)
      return { totalNetAmountByCurrency: {} as Record<CurrencyCode, number> };

    const totalNetAmountByCurrency = getTotalNetAmountByCurrency(
      profile.userId,
      currentGroup.paymentRecords,
    );

    return {
      totalNetAmountByCurrency,
      hasUnresolvedExpenses: Object.values(totalNetAmountByCurrency).some(
        (amount) => amount !== 0,
      ),
    };
  }, [currentGroup, profile.userId]);

  const memberListText = useMemo(() => {
    if (!currentGroup) return "";
    const names = groupUsers
      .filter((item) => item.id !== profile.userId)
      .map((item) => item.name);

    return names.length > 2
      ? `${names.slice(0, 2).join(", ")} ${t("GroupDetailScreen:and-more")}`
      : names.join(` ${t("GroupDetailScreen:and")} `);
  }, [currentGroup, groupUsers, profile.userId, t]);

  if (!currentGroup) {
    return (
      <View style={[styles.emptyContainer, { paddingBottom: headerHeight }]}>
        <AnimatedLottieView
          autoPlay
          style={styles.lottie}
          source={require("@/assets/lottie/empty.json")}
        />
        <Text style={styles.emptyText}>
          {t("GroupDetailScreen:no-group-warning")}
        </Text>
        <Button
          title="Add Group"
          onPress={() =>
            navigation.navigate("GroupForm", {
              step: 0,
              shouldEditUserList: true,
            })
          }
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.sectionPadding}>
          <Text h1>{currentGroup.name}</Text>
          <Text style={styles.subtitle}>
            {hasUnresolvedExpenses
              ? t("GroupDetailScreen:expense-reminder")
              : t("GroupDetailScreen:expense-reminder-empty")}
          </Text>
          <HStack gap={6} justifyContent="flex-start" flexWrap="wrap">
            {Object.entries(totalNetAmountByCurrency).map(
              ([currencyCode, totalNetAmount]) => {
                if (totalNetAmount === 0) return null;

                const amount = formatAmount(
                  totalNetAmount,
                  currencyCode as CurrencyCode,
                  { currencySymbol: "code" },
                );
                const sign = Math.sign(totalNetAmount);

                return (
                  <TouchableOpacity
                    key={currencyCode}
                    style={styles.amountButton}
                    onPress={() =>
                      navigation.navigate("GroupSummary", {
                        groupId: currentGroup.id,
                      })
                    }
                  >
                    <HStack gap={4}>
                      <Text
                        key={currencyCode}
                        style={[
                          styles.amountText,
                          sign > 0 && { color: theme.colors.success },
                          sign < 0 && { color: theme.colors.error },
                        ]}
                      >
                        {amount}
                      </Text>
                    </HStack>
                  </TouchableOpacity>
                );
              },
            )}
          </HStack>
        </View>
        <View>
          <HStack style={[styles.sectionPadding, { marginBottom: 2 }]}>
            <Text style={styles.label}>{t("GroupDetailScreen:summary")}</Text>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("GroupSummary", {
                  groupId: currentGroup.id,
                })
              }
            >
              <AntDesign
                name="arrowright"
                size={24}
                color={theme.colors.primary}
              />
            </TouchableOpacity>
          </HStack>
          <GroupDetailSummaryCarousel group={currentGroup} />
        </View>

        <View style={styles.sectionPadding}>
          <Text style={styles.label}>{t("GroupDetailScreen:member")}</Text>
          <TouchableOpacity
            style={styles.members}
            onPress={() =>
              navigation.navigate("UserList", { groupId: currentGroup.id })
            }
          >
            <HStack gap={8}>
              <Text>
                {t("GroupDetailScreen:current-username", {
                  name:
                    groupUsers.find((i) => i.id === profile.userId)?.name ??
                    t("GroupDetailScreen:not-in-group"),
                })}
              </Text>
              <Text style={{ flex: 1, textAlign: "right" }} numberOfLines={1}>
                {memberListText}
              </Text>
            </HStack>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionPadding}>
          <Text style={styles.label}>{t("GroupDetailScreen:payment")}</Text>
          <HStack>
            <Text>
              {t("GroupDetailScreen:payment-count", {
                count: currentGroup.paymentRecords.length,
              })}
            </Text>

            <TouchableOpacity
              onPress={() => navigation.navigate("PaymentRecordList")}
            >
              <AntDesign
                name="arrowright"
                size={24}
                color={theme.colors.primary}
              />
            </TouchableOpacity>
          </HStack>
        </View>
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
    gap: 16,
    paddingBottom: 32,
    paddingTop: 16,
  },
  sectionPadding: {
    paddingHorizontal: 16,
  },
  emptyContainer: {
    justifyContent: "center",
    padding: 16,
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  emptyText: {
    textAlign: "center",
    marginBottom: 16,
    fontSize: 16,
    fontWeight: "500",
  },
  subtitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 4,
  },
  amountButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.colors.divider,
    width: "auto",
    flexGrow: 0,
  },
  amountText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  lottie: {
    height: 300,
    aspectRatio: 1,
    alignSelf: "center",
    marginBottom: 32,
  },
  label: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  members: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.colors.divider,
  },
}));

export default GroupDetailScreen;
