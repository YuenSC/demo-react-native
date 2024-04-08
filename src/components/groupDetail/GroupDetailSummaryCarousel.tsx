import { AntDesign } from "@expo/vector-icons";
import { Text, makeStyles } from "@rneui/themed";
import { memo } from "react";
import {
  ScrollView,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";

import FullWidthArrow from "./FullWidthArrow";
import AvatarIcon from "../AvatarIcon";
import { HStack, VStack } from "../common/Stack";

import { Group } from "@/store/reducers/groups";
import { AvatarColor } from "@/types/AvatarColor";
import { CurrencyCode } from "@/types/Currency";
import { formatAmount } from "@/utils/payment";

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
          <VStack
            key={currencyCode}
            gap={8}
            alignItems="stretch"
            style={styles.scrollViewItem}
          >
            <Text h3>{currencyCode}</Text>
            <VStack alignItems="stretch" gap={4}>
              {items.map((item) => (
                <TouchableOpacity key={currencyCode + item.payerName}>
                  <HStack>
                    <VStack>
                      <AvatarIcon
                        userName={item.payerName}
                        color={AvatarColor.AmethystPurple}
                        size="small"
                        isShowName
                      />
                    </VStack>
                    <View style={styles.amountContainer}>
                      <FullWidthArrow />
                      <VStack>
                        <Text>
                          {formatAmount(
                            item.amount,
                            currencyCode as CurrencyCode,
                          )}
                        </Text>
                      </VStack>
                    </View>
                    <VStack>
                      <AvatarIcon
                        userName={item.receiverName}
                        color={AvatarColor.AmethystPurple}
                        size="small"
                        isShowName
                      />
                    </VStack>
                  </HStack>
                </TouchableOpacity>
              ))}
            </VStack>
          </VStack>
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
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.colors.divider,
  },
  amountContainer: {
    flex: 1,
    marginHorizontal: 12,
  },
}));

GroupDetailSummaryCarousel.displayName = "GroupDetailSummaryCarousel";

export default GroupDetailSummaryCarousel;
