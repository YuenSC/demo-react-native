import { Text, makeStyles } from "@rneui/themed";
import { memo } from "react";
import { View } from "react-native";

import FullWidthArrow from "./FullWidthArrow";
import AvatarIcon from "../AvatarIcon";
import { HStack, VStack } from "../common/Stack";

import { CurrencyCode } from "@/types/Currency";
import { User } from "@/types/User";
import { formatAmount, roundAmountToDecimal } from "@/utils/payment";

type IPaymentRelationshipDisplayProps = {
  payer: User;
  receiver: User;
  requiredAmount: number;
  currencyCode: CurrencyCode;
};

const PaymentRelationshipDisplay = memo<IPaymentRelationshipDisplayProps>(
  ({ payer, receiver, requiredAmount, currencyCode }) => {
    const styles = useStyles();

    return (
      <HStack>
        <AvatarIcon
          userName={payer.name}
          color={payer.avatarColor}
          size="small"
          isShowName
        />
        <View style={styles.container}>
          <FullWidthArrow />
          <VStack>
            <Text>
              {formatAmount(
                roundAmountToDecimal(requiredAmount),
                currencyCode as CurrencyCode,
              )}
            </Text>
          </VStack>
        </View>
        <AvatarIcon
          userName={receiver.name}
          color={receiver.avatarColor}
          size="small"
          isShowName
        />
      </HStack>
    );
  },
);

const useStyles = makeStyles((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
}));

PaymentRelationshipDisplay.displayName = "PaymentRelationshipDisplay";

export default PaymentRelationshipDisplay;
