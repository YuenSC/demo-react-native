import { CurrencyCode, currencyCodes } from "@/types/Currency";
import { PaymentDetail, PaymentRecord } from "@/types/PaymentRecord";
import { User } from "@/types/User";

export const getPaymentRelationship = (
  members: User[],
  records = [] as PaymentRecord[],
) => {
  const memberById = Object.fromEntries(
    members.map((member) => [member.id, member]),
  );

  return records.reduce(
    (paymentRelationshipByCurrency, record) => {
      paymentRelationshipByCurrency[record.currencyCode] =
        paymentRelationshipByCurrency[record.currencyCode] ?? {};

      const paymentRelationship =
        paymentRelationshipByCurrency[record.currencyCode];

      const { actualAmountPerUser: payerActualAmountPerUser } =
        getActualAmountPerUser(record.amount, record.payers);
      const { actualAmountPerUser: payeeActualAmountPerUser } =
        getActualAmountPerUser(record.amount, record.payees);

      let payerIndex = 0;
      let receiverIndex = 0;

      if (record.currencyCode === "HKD") {
        console.log("here");
      }
      while (receiverIndex < payeeActualAmountPerUser.length) {
        const payer = payerActualAmountPerUser[payerIndex];
        const receiver = payeeActualAmountPerUser[receiverIndex];

        if (!payer || !receiver) break;

        // receiver need to paid back to payer
        const amountToPaid = Math.min(receiver.amount, payer.amount);
        const isMoneyLeftInReceiver = receiver.amount > payer.amount;

        if (payer.id !== receiver.id) {
          paymentRelationship[receiver.id] = {
            payer: memberById[receiver.id],
            receiverId: payer.id,
            receiver: memberById[payer.id],
            requiredAmount:
              receiver.amount +
              (paymentRelationship[receiver.id]?.requiredAmount ?? 0),
          };
        }

        payer.amount -= amountToPaid;
        receiver.amount -= amountToPaid;

        if (isMoneyLeftInReceiver) {
          payerIndex++;
        } else {
          receiverIndex++;
        }
      }

      return paymentRelationshipByCurrency;
    },
    {} as Record<
      CurrencyCode,
      Record<
        string, // payerId
        {
          payer: User;
          receiver: User;
          receiverId: string;
          requiredAmount: number;
        }
      >
    >,
  );
};

export const getTotalNetAmount = (userId: string, records: PaymentRecord[]) => {
  return records.reduce(
    (prev, curr) => {
      const { netAmount, currencyCode } = getRelatedAmount(userId, curr) ?? {
        netAmount: 0,
      };

      if (!currencyCode) return prev;

      return {
        ...prev,
        [currencyCode]: (prev[currencyCode] ?? 0) + netAmount,
      };
    },
    {} as Record<CurrencyCode, number>,
  );
};

export const getRelatedAmount = (userId?: string, record?: PaymentRecord) => {
  if (!userId || !record) return undefined;

  let paidAmount = 0;
  let receivedAmount = 0;

  const payerRecord = record.payers.find((payer) => payer.id === userId);
  const payeeRecord = record.payees.find((payee) => payee.id === userId);

  if (payerRecord) {
    const { actualAmountPerUser } = getActualAmountPerUser(
      record.amount,
      record.payers,
    );
    paidAmount = actualAmountPerUser.find((i) => i.id === userId)?.amount ?? 0;
  }

  if (payeeRecord) {
    const { actualAmountPerUser } = getActualAmountPerUser(
      record.amount,
      record.payees,
    );
    receivedAmount =
      actualAmountPerUser.find((i) => i.id === userId)?.amount ?? 0;
  }

  return {
    paidAmount,
    receivedAmount,
    netAmount: paidAmount - receivedAmount,
    currencyCode: record.currencyCode,
  };
};

export const getActualAmountPerUser = (
  amount: number,
  payment: PaymentDetail[],
) => {
  const autoSplitCount = payment.filter((i) => i.amount === "auto").length;

  const amountPaid = payment
    .filter((i) => i.amount !== "auto")
    .reduce((prev, curr) => prev + (curr.amount as number), 0);

  const autoSplitAmount =
    autoSplitCount === 0
      ? 0
      : Math.max(0, (amount - amountPaid) / autoSplitCount);
  const actualAmountPerUser = payment.map((i) => ({
    id: i.id,
    amount: i.amount === "auto" ? autoSplitAmount : i.amount ?? 0,
  }));
  const realAmountSum = actualAmountPerUser.reduce(
    (prev, curr) => prev + curr.amount,
    0,
  );

  return {
    actualAmountPerUser,
    isPaymentEqualExpense: Math.round(realAmountSum) === amount,
  };
};

export const roundAmountToTwoDecimal = (amount: number) => {
  return parseFloat(amount.toFixed(2));
};

export const formatAmount = (
  amount: number,
  currencyCode: CurrencyCode,
  options?: {
    currencySymbol?: "symbol" | "code";
  },
) => {
  const sign = amount < 0 ? "-" : "";
  const currencySymbol = options?.currencySymbol ?? "symbol";

  return (
    sign +
    currencyCodes[currencyCode][currencySymbol] +
    (currencySymbol === "code" ? " " : "") +
    Math.abs(amount).toLocaleString()
  );
};
