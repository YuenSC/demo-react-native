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
import { CurrencyCode } from "@/types/Currency";
import {
  formatAmount,
  getPaymentRelationship,
  roundAmountToTwoDecimal,
} from "@/utils/payment";

type IGroupDetailSummaryCarouselProps = {
  group: Group;
};

const GroupDetailSummaryCarousel = memo<IGroupDetailSummaryCarouselProps>(
  ({ group }) => {
    const windowDimensions = useWindowDimensions();

    const paymentRelationshipByCurrency = getPaymentRelationship(
      group.members,
      group.paymentRecords,
    );

    console.log(
      "paymentRelationshipByCurrency",
      JSON.stringify(paymentRelationshipByCurrency, null, 2),
    );

    const isSingleCurrency =
      Object.keys(paymentRelationshipByCurrency).length === 1;

    const itemWidth = isSingleCurrency
      ? windowDimensions.width - 32
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
        {Object.entries(paymentRelationshipByCurrency).map(
          ([currencyCode, items]) => (
            <VStack
              key={currencyCode}
              gap={8}
              alignItems="stretch"
              justifyContent="flex-start"
              style={styles.scrollViewItem}
            >
              <Text h3>{currencyCode}</Text>
              <VStack alignItems="stretch" gap={16}>
                {Object.values(items).map((item) => (
                  <TouchableOpacity key={currencyCode + item.payer.name}>
                    <HStack>
                      <VStack>
                        <AvatarIcon
                          userName={item.payer.name}
                          color={item.payer.avatarColor}
                          size="small"
                          isShowName
                        />
                      </VStack>
                      <View style={styles.amountContainer}>
                        <FullWidthArrow />
                        <VStack>
                          <Text>
                            {formatAmount(
                              roundAmountToTwoDecimal(item.requiredAmount),
                              currencyCode as CurrencyCode,
                            )}
                          </Text>
                        </VStack>
                      </View>
                      <VStack>
                        <AvatarIcon
                          userName={item.receiver.name}
                          color={item.receiver.avatarColor}
                          size="small"
                          isShowName
                        />
                      </VStack>
                    </HStack>
                  </TouchableOpacity>
                ))}
              </VStack>
            </VStack>
          ),
        )}
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
