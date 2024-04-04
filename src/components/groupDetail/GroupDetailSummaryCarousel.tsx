import { Text, makeStyles } from "@rneui/themed";
import { memo } from "react";
import { ScrollView, View, useWindowDimensions } from "react-native";

import { HStack } from "../common/Stack";

import { Group } from "@/store/reducers/groups";

type IGroupDetailSummaryCarouselProps = {
  group: Group;
};

const GroupDetailSummaryCarousel = memo<IGroupDetailSummaryCarouselProps>(
  ({ group }) => {
    const windowDimensions = useWindowDimensions();

    const dataByCurrency = {
      HKD: [
        {
          payerName: "User 1",
          receiverName: "User 2",
          amount: 100,
        },
        {
          payerName: "User 2",
          receiverName: "User 3",
          amount: 200,
        },
        {
          payerName: "User 3",
          receiverName: "User 1",
          amount: 300,
        },
      ],
      JPY: [
        {
          payerName: "User 1",
          receiverName: "User 2",
          amount: 100,
        },
        {
          payerName: "User 2",
          receiverName: "User 3",
          amount: 200,
        },
        {
          payerName: "User 3",
          receiverName: "User 1",
          amount: 300,
        },
      ],
    };

    const isSingleCurrency = Object.keys(dataByCurrency).length === 1;

    const itemWidth = isSingleCurrency
      ? windowDimensions.width
      : windowDimensions.width * 0.8;
    const styles = useStyles(itemWidth);

    return (
      <ScrollView
        horizontal
        contentContainerStyle={{ gap: 16, paddingHorizontal: 16 }}
        showsHorizontalScrollIndicator={false}
        snapToAlignment="start"
        snapToInterval={itemWidth + 16}
        decelerationRate="fast"
        scrollEnabled={!isSingleCurrency}
      >
        {Object.entries(dataByCurrency).map(([currencyCode, items], index) => (
          <View style={styles.scrollViewItem}>
            <Text h3>{currencyCode}</Text>
            {items.map((item, index) => (
              <HStack key={index}>
                <Text>{item.payerName}</Text>
                <Text>{item.amount}</Text>
                <Text>{item.receiverName}</Text>
              </HStack>
            ))}
          </View>
        ))}
      </ScrollView>
    );
  },
);

const useStyles = makeStyles((theme, itemWidth: number) => ({
  scrollViewItem: {
    width: itemWidth,
    backgroundColor: theme.colors.background,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.grey3,
  },
}));

GroupDetailSummaryCarousel.displayName = "GroupDetailSummaryCarousel";

export default GroupDetailSummaryCarousel;
