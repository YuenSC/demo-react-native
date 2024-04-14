import { Text, makeStyles, useTheme } from "@rneui/themed";
import { memo } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";

import BillCategoryIcon from "./BillCategoryIcon";
import { HStack, VStack } from "./common/Stack";

import { PaymentRecordListTarget } from "@/screens/bottomTab/PaymentRecordListScreen";
import { BillCategoryEnum } from "@/types/BillCategories";
import { PaymentRecord } from "@/types/PaymentRecord";
import { formatDate } from "@/utils/formatDate";
import { formatAmount, getRelatedAmount } from "@/utils/payment";

type IPaymentRecordDisplayProps = {
  record: PaymentRecord;
  userId: string;
  paymentTarget?: PaymentRecordListTarget;
};

const PaymentRecordDisplay = memo<IPaymentRecordDisplayProps>(
  ({ record, userId, paymentTarget = PaymentRecordListTarget.You }) => {
    const styles = useStyles();
    const { theme } = useTheme();
    const { i18n } = useTranslation();

    const relatedAmount = getRelatedAmount(userId, record);
    const amount =
      paymentTarget === PaymentRecordListTarget.Group
        ? record.amount
        : relatedAmount?.netAmount;
    const netAmountSign = Math.sign(amount ?? 0);

    return (
      <View style={styles.item}>
        <VStack gap={4} justifyContent="flex-start" alignItems="flex-start">
          <HStack gap={4} justifyContent="flex-start">
            <BillCategoryIcon category={record.category as BillCategoryEnum} />
            <Text>{formatDate(record.date, i18n.language)}</Text>
          </HStack>

          <Text numberOfLines={1}>{record.comment}</Text>
        </VStack>
        <Text
          style={[
            styles.amount,
            paymentTarget === PaymentRecordListTarget.You &&
              netAmountSign === 1 && { color: theme.colors.success },
            paymentTarget === PaymentRecordListTarget.You &&
              netAmountSign === -1 && { color: theme.colors.error },
          ]}
          numberOfLines={1}
        >
          {formatAmount(amount ?? 0, record?.currencyCode)}
        </Text>
      </View>
    );
  },
);

const useStyles = makeStyles((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
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
    maxWidth: 100,
  },
}));

PaymentRecordDisplay.displayName = "PaymentRecordDisplay";

export default PaymentRecordDisplay;
