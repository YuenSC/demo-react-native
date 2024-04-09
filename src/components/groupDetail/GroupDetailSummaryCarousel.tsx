import { useNavigation } from "@react-navigation/native";
import { Text, makeStyles } from "@rneui/themed";
import { memo } from "react";
import { ScrollView, View, useWindowDimensions } from "react-native";

import GroupDetailSummaryItem from "./GroupDetailSummaryItem";

import { Group } from "@/store/reducers/groups";
import { CurrencyCode } from "@/types/Currency";
import { getPaymentRelationshipByCurrency } from "@/utils/payment";

type IGroupDetailSummaryCarouselProps = {
  group: Group;
};

const GroupDetailSummaryCarousel = memo<IGroupDetailSummaryCarouselProps>(
  ({ group }) => {
    const styles = useStyles();
    const windowDimensions = useWindowDimensions();
    const navigation = useNavigation();

    const {
      paymentRelationshipByCurrency,
      simplifiedPaymentRelationshipByCurrency,
    } = getPaymentRelationshipByCurrency(group.members, group.paymentRecords);

    const isSingleCurrency =
      Object.keys(paymentRelationshipByCurrency).length === 1;

    const itemWidth = isSingleCurrency
      ? windowDimensions.width - 32
      : windowDimensions.width * 0.8;

    if (group.paymentRecords.length === 0) {
      return (
        <View style={styles.container}>
          <Text>No payment records found</Text>
        </View>
      );
    }

    return (
      <ScrollView
        horizontal
        contentContainerStyle={styles.container}
        showsHorizontalScrollIndicator={false}
        snapToAlignment="start"
        snapToInterval={itemWidth + 16}
        decelerationRate="fast"
        scrollEnabled={!isSingleCurrency}
      >
        {Object.entries(paymentRelationshipByCurrency).map(
          ([currencyCode, items]) => (
            <GroupDetailSummaryItem
              key={currencyCode}
              onSummaryItemPress={() =>
                navigation.navigate("GroupSummary", { groupId: group.id })
              }
              currencyCode={currencyCode as CurrencyCode}
              itemWidth={itemWidth}
              paymentRelationship={items}
              simplifiedPaymentRelationship={
                simplifiedPaymentRelationshipByCurrency[
                  currencyCode as CurrencyCode
                ]
              }
            />
          ),
        )}
      </ScrollView>
    );
  },
);

const useStyles = makeStyles((theme) => ({
  container: {
    gap: 16,
    paddingHorizontal: 16,
  },
}));

GroupDetailSummaryCarousel.displayName = "GroupDetailSummaryCarousel";

export default GroupDetailSummaryCarousel;
