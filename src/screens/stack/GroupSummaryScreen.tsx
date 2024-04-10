import { Text, makeStyles } from "@rneui/themed";
import { useMemo } from "react";
import { SectionList, TouchableOpacity, View } from "react-native";

import { HStack, VStack } from "@/components/common/Stack";
import PaymentRelationshipDisplay from "@/components/groupDetail/PaymentRelationshipDisplay";
import { useAppSelector } from "@/hooks/reduxHook";
import { groupSelector } from "@/store/reducers/groups";
import { BillCategoryEnum } from "@/types/BillCategories";
import { CurrencyCode } from "@/types/Currency";
import { IStackScreenProps } from "@/types/navigation";
import {
  formatAmount,
  getPaymentRelationshipByCurrency,
  getTotalNetAmount,
} from "@/utils/payment";

const GroupSummaryScreen = ({
  navigation,
  route: {
    params: { groupId },
  },
}: IStackScreenProps<"GroupSummary">) => {
  const styles = useStyles();

  const group = useAppSelector((state) => groupSelector(state, groupId));

  const { simplifiedPaymentRelationshipByCurrency } =
    getPaymentRelationshipByCurrency(group?.members, group?.paymentRecords);

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
        ListHeaderComponent={() => {
          return (
            <View>
              <Text h1 style={styles.horizontalSpacing}>
                Summary
              </Text>
              <VStack alignItems="stretch" style={styles.members}>
                {group?.members?.map((member, index) => {
                  const totalNetAmount = getTotalNetAmount(
                    member.id,
                    group.paymentRecords,
                  );
                  const isLast = index === group.members.length - 1;

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
                  comment: "Debt settlement 💰",
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
    </View>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
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
