import { AntDesign } from "@expo/vector-icons";
import { Button, Switch, Text, makeStyles, useTheme } from "@rneui/themed";
import { memo, useState } from "react";
import { useTranslation } from "react-i18next";
import { TouchableOpacity } from "react-native";

import PaymentRelationshipDisplay from "./PaymentRelationshipDisplay";
import { HStack, VStack } from "../common/Stack";

import { CurrencyCode } from "@/types/Currency";
import { PaymentRelationship } from "@/utils/payment";

type IGroupDetailSummaryItemProps = {
  currencyCode: CurrencyCode;
  paymentRelationship: PaymentRelationship;
  simplifiedPaymentRelationship: PaymentRelationship;
  itemWidth: number;
  onSummaryItemPress: () => void;
};

const GroupDetailSummaryItem = memo<IGroupDetailSummaryItemProps>(
  ({
    currencyCode,
    paymentRelationship,
    itemWidth,
    simplifiedPaymentRelationship,
    onSummaryItemPress,
  }) => {
    const styles = useStyles(itemWidth);
    const { theme } = useTheme();
    const { t } = useTranslation();

    const [isUsingSimplified, setIsUsingSimplified] = useState(true);

    const relationship = isUsingSimplified
      ? simplifiedPaymentRelationship
      : paymentRelationship;

    return (
      <VStack
        gap={8}
        alignItems="stretch"
        justifyContent="flex-start"
        style={styles.scrollViewItem}
      >
        <HStack alignItems="flex-start">
          <VStack alignItems="flex-start">
            <Text h3>{currencyCode}</Text>
            <HStack>
              <Text>
                {isUsingSimplified
                  ? t("GroupDetailSummaryItem:simplified")
                  : t("GroupDetailSummaryItem:individual")}
              </Text>
              <Switch
                value={isUsingSimplified}
                onValueChange={setIsUsingSimplified}
                style={styles.switch}
                ios_backgroundColor={theme.colors.grey2}
                trackColor={{
                  true: theme.colors.primary,
                  false: theme.colors.grey2,
                }}
              />
            </HStack>
          </VStack>

          <Button
            size="sm"
            buttonStyle={styles.rounded}
            onPress={onSummaryItemPress}
          >
            <AntDesign name="checkcircleo" size={24} color="black" />
          </Button>
        </HStack>

        <VStack alignItems="stretch" gap={16}>
          {relationship?.map((item) => (
            <TouchableOpacity
              onPress={onSummaryItemPress}
              key={currencyCode + item.payer.name + item.receiver.name}
            >
              <PaymentRelationshipDisplay
                currencyCode={currencyCode}
                payer={item.payer}
                receiver={item.receiver}
                requiredAmount={item.requiredAmount}
              />
            </TouchableOpacity>
          ))}
        </VStack>
      </VStack>
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

  switch: {
    transform: [
      {
        scaleX: 0.8,
      },
      {
        scaleY: 0.8,
      },
    ],
  },
  rounded: {
    borderRadius: 50,
  },
}));

GroupDetailSummaryItem.displayName = "GroupDetailSummaryItem";

export default GroupDetailSummaryItem;
