import { Text, makeStyles } from "@rneui/themed";
import AnimatedLottieView from "lottie-react-native";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { SectionList, TouchableOpacity, View } from "react-native";
import { BannerAd, BannerAdSize } from "react-native-google-mobile-ads";
import { EdgeInsets, useSafeAreaInsets } from "react-native-safe-area-context";

import Config from "@/Config";
import { HStack, VStack } from "@/components/common/Stack";
import PaymentRelationshipDisplay from "@/components/groupDetail/PaymentRelationshipDisplay";
import { useAppSelector } from "@/hooks/reduxHook";
import { groupSelector } from "@/store/reducers/groups";
import { groupUsersSelector } from "@/store/reducers/users";
import { BillCategoryEnum } from "@/types/BillCategories";
import { CurrencyCode } from "@/types/Currency";
import { IStackScreenProps } from "@/types/navigation";
import {
  formatAmount,
  getPaymentRelationshipByCurrency,
  getTotalNetAmountByUser,
} from "@/utils/payment";

const GroupSummaryScreen = ({
  navigation,
  route: {
    params: { groupId },
  },
}: IStackScreenProps<"GroupSummary">) => {
  const insets = useSafeAreaInsets();
  const styles = useStyles(insets);
  const { t } = useTranslation();

  const group = useAppSelector((state) => groupSelector(state, groupId));
  const groupUsers = useAppSelector((state) =>
    groupUsersSelector(state, groupId),
  );

  const { simplifiedPaymentRelationshipByCurrency } =
    getPaymentRelationshipByCurrency(groupUsers, group?.paymentRecords);

  const sections = useMemo(() => {
    return Object.entries(simplifiedPaymentRelationshipByCurrency).map(
      ([currencyCode, items]) => ({
        title: currencyCode,
        data: items,
      }),
    );
  }, [simplifiedPaymentRelationshipByCurrency]);

  return (
    <View style={styles.container}>
      <SectionList
        sections={sections}
        style={styles.contentContainer}
        contentContainerStyle={styles.contentContainer}
        keyExtractor={(item, index) => item.payer.id + item.receiver.id + index}
        ListEmptyComponent={() => {
          return (
            <VStack>
              <AnimatedLottieView
                autoPlay
                style={[styles.lottie]}
                source={require("@/assets/lottie/empty.json")}
              />

              <Text style={styles.emptyText}>
                {t("PaymentRecordListScreen:no-payment-records-found")}
              </Text>
            </VStack>
          );
        }}
        ListHeaderComponent={() => {
          return (
            <View>
              <Text h1 style={styles.horizontalSpacing}>
                {t("GroupSummaryScreen:summary")}
              </Text>
              <VStack alignItems="stretch" style={styles.members}>
                {groupUsers?.map((member, index) => {
                  const totalNetAmount = getTotalNetAmountByUser(
                    member.id,
                    group?.paymentRecords ?? [],
                  );
                  const isLast = index === groupUsers.length - 1;

                  return (
                    <HStack
                      key={member.id}
                      style={[
                        styles.member,
                        styles.horizontalSpacing,
                        !isLast && styles.memberBottomBorder,
                      ]}
                    >
                      <Text key={member.id}>{member.name}</Text>
                      <VStack alignItems="flex-end">
                        {Object.entries(totalNetAmount).map(
                          ([currencyCode, amount]) => (
                            <Text
                              key={currencyCode}
                              style={[
                                styles.amount,
                                amount > 0 && styles.amountPositive,
                                amount < 0 && styles.amountNegative,
                              ]}
                            >
                              {formatAmount(
                                amount,
                                currencyCode as CurrencyCode,
                              )}
                            </Text>
                          ),
                        )}
                      </VStack>
                    </HStack>
                  );
                })}
              </VStack>
            </View>
          );
        }}
        renderSectionHeader={({ section: { title } }) => (
          <Text h3 style={[styles.sectionHeader, styles.horizontalSpacing]}>
            {title}
          </Text>
        )}
        renderItem={({ item, section: { title: currencyCode } }) => (
          <TouchableOpacity
            style={[styles.horizontalSpacing]}
            onPress={() => {
              navigation.navigate("AddPayment", {
                groupId,
                defaultValue: {
                  amount: item.requiredAmount,
                  category: BillCategoryEnum.Miscellaneous,
                  comment: t("GroupSummaryScreen:debt-settlement"),
                  currencyCode: currencyCode as CurrencyCode,
                  date: new Date().toISOString(),
                  groupId,
                  payers: [{ id: item.payer.id, amount: "auto" }],
                  payees: [{ id: item.receiver.id, amount: "auto" }],
                },
              });
            }}
          >
            <PaymentRelationshipDisplay
              currencyCode={currencyCode as CurrencyCode}
              payer={item.payer}
              receiver={item.receiver}
              requiredAmount={item.requiredAmount}
            />
          </TouchableOpacity>
        )}
      />

      <BannerAd
        unitId={Config.adBannerUnitId}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
      />
    </View>
  );
};

const useStyles = makeStyles((theme, insets: EdgeInsets) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingBottom: insets.bottom,
  },
  horizontalSpacing: {
    paddingHorizontal: 16,
  },
  contentContainer: {
    paddingVertical: 16,
    gap: 8,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
  },
  members: {
    backgroundColor: theme.colors.modal,
    marginVertical: 16,
  },
  member: {
    paddingVertical: 8,
  },
  lottie: {
    width: "100%",
    aspectRatio: 1,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 16,
  },
  sectionHeader: {
    backgroundColor: theme.colors.background,
  },
  memberBottomBorder: {
    borderBottomWidth: 1,
    borderColor: theme.colors.divider,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.divider,
  },
  amount: {
    fontWeight: "bold",
  },
  amountPositive: {
    color: theme.colors.success,
  },
  amountNegative: {
    color: theme.colors.error,
  },
}));

export default GroupSummaryScreen;
