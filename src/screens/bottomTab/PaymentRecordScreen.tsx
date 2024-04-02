import { Text, makeStyles } from "@rneui/themed";
import { FlatList, TouchableOpacity } from "react-native";

import BillCategoryIcon from "@/components/BillCategoryIcon";
import HStack from "@/components/common/HStack";
import VStack from "@/components/common/VStack";
import { useAppSelector } from "@/hooks/reduxHook";
import { currentGroupSelector } from "@/store/reducers/groups";
import { BillCategoryEnum } from "@/types/BillCategories";
import { IBottomTabScreenProps } from "@/types/navigation";

const PaymentRecordScreen = ({
  navigation,
  route,
}: IBottomTabScreenProps<"PaymentRecord">) => {
  const styles = useStyles();
  const currentGroup = useAppSelector(currentGroupSelector);

  if (!currentGroup) {
    return null;
  }

  // Filter by currency and sort by date
  return (
    <FlatList
      data={currentGroup.paymentRecords}
      style={styles.container}
      ListHeaderComponent={() => <Text h1>Payments</Text>}
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
          <VStack gap={4}>
            <HStack gap={4}>
              <BillCategoryIcon category={item.category as BillCategoryEnum} />
              <Text>
                {new Date(item.date).toLocaleDateString("en-US", {
                  day: "2-digit",
                  month: "numeric",
                  year: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                })}
              </Text>
            </HStack>

            <Text>{item.comment}</Text>
          </VStack>
          <Text
            style={styles.amount}
          >{`${item.currencyCode}${item.amount}`}</Text>
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
  },
}));

export default PaymentRecordScreen;
