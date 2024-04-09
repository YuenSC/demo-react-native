import { AntDesign } from "@expo/vector-icons";
import { useHeaderHeight } from "@react-navigation/elements";
import { Button, Text, makeStyles, useTheme } from "@rneui/themed";
import AnimatedLottieView from "lottie-react-native";
import { useMemo } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";

import { HStack } from "@/components/common/Stack";
import GroupDetailSummaryCarousel from "@/components/groupDetail/GroupDetailSummaryCarousel";
import { useAppSelector } from "@/hooks/reduxHook";
import { currentGroupSelector } from "@/store/reducers/groups";
import { CurrencyCode } from "@/types/Currency";
import { IBottomTabScreenProps } from "@/types/navigation";
import {
  formatAmount,
  getTotalNetAmount as getTotalNetAmountByCurrency,
} from "@/utils/payment";

const GroupDetailScreen = ({
  navigation,
}: IBottomTabScreenProps<"GroupDetail">) => {
  const styles = useStyles();
  const headerHeight = useHeaderHeight();
  const { theme } = useTheme();
  const currentGroup = useAppSelector(currentGroupSelector);

  const profile = useAppSelector((state) => state.profile);

  const { totalNetAmountByCurrency, hasUnresolvedExpenses } = useMemo(() => {
    if (!currentGroup || !profile.id)
      return { totalNetAmountByCurrency: {} as Record<CurrencyCode, number> };

    const totalNetAmountByCurrency = getTotalNetAmountByCurrency(
      profile.id,
      currentGroup.paymentRecords,
    );
    return {
      totalNetAmountByCurrency,
      hasUnresolvedExpenses: Object.values(totalNetAmountByCurrency).some(
        (amount) => amount !== 0,
      ),
    };
  }, [currentGroup, profile.id]);

  const memberListText = useMemo(() => {
    if (!currentGroup) return "";
    const names = currentGroup.members
      .filter((item) => item.name !== profile.name)
      .map((item) => item.name);

    return names.length > 2
      ? `${names.slice(0, 2).join(", ")} and more ...`
      : names.join(" and ");
  }, [currentGroup, profile.name]);

  if (!currentGroup) {
    return (
      <View style={[styles.emptyContainer, { paddingBottom: headerHeight }]}>
        <AnimatedLottieView
          autoPlay
          style={styles.lottie}
          source={require("@/assets/lottie/empty.json")}
        />
        <Text style={styles.emptyText}>
          You haven't created any group yet. Please create a group to get
          started
        </Text>
        <Button
          onPress={() => {
            console.log("onPress");
          }}
          title="Add Group"
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.sectionPadding}>
          <Text h1>{currentGroup.name}</Text>
          <Text style={styles.subtitle}>
            {hasUnresolvedExpenses
              ? "Your unresolved expenses are as below"
              : "You have no unresolved expenses. Good job!"}
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
                      <AntDesign
                        name="checkcircleo"
                        size={24}
                        color={theme.colors.grey3}
                      />
                    </HStack>
                  </TouchableOpacity>
                );
              },
            )}
          </HStack>
        </View>
        <View>
          <Text style={[styles.label, styles.sectionPadding]}>Summary</Text>
          <GroupDetailSummaryCarousel group={currentGroup} />
        </View>

        <View style={styles.sectionPadding}>
          <Text style={styles.label}>Member</Text>
          <TouchableOpacity
            style={styles.members}
            onPress={() =>
              navigation.navigate("GroupUserList", { groupId: currentGroup.id })
            }
          >
            <Text>{`Current: ${profile.name}`}</Text>
            <Text>{memberListText}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionPadding}>
          <Text style={styles.label}>Payment</Text>
          <HStack>
            <Text>
              You have {currentGroup.paymentRecords.length} records in this
              group
            </Text>

            <TouchableOpacity
              onPress={() => navigation.navigate("PaymentRecord")}
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
    </View>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingVertical: 16,
    gap: 16,
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
    flexDirection: "row",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.colors.divider,
    justifyContent: "space-between",
  },
}));

export default GroupDetailScreen;
