import { CurrencyCode, currencyCodes } from "@/types/Currency";
import { PaymentDetail, PaymentRecord } from "@/types/PaymentRecord";
import { User } from "@/types/User";

export type PaymentRelationship = {
  payer: User;
  receiver: User;
  requiredAmount: number;
}[];

export const getPaymentRelationshipByCurrency = (
  members: User[],
  records = [] as PaymentRecord[],
) => {
  const memberById = Object.fromEntries(
    members.map((member) => [member.id, member]),
  );

  const paymentRelationshipByCurrency = records.reduce(
    (paymentRelationshipByCurrency, record) => {
      paymentRelationshipByCurrency[record.currencyCode] =
        paymentRelationshipByCurrency[record.currencyCode] ?? [];

      const paymentRelationship =
        paymentRelationshipByCurrency[record.currencyCode];

      const { actualAmountPerUser: payerActualAmountPerUser } =
        getActualAmountPerUser(record.amount, record.payers);
      const { actualAmountPerUser: payeeActualAmountPerUser } =
        getActualAmountPerUser(record.amount, record.payees);

      let payerIndex = 0;
      let receiverIndex = 0;

      while (receiverIndex < payeeActualAmountPerUser.length) {
        const payer = payerActualAmountPerUser[payerIndex];
        const receiver = payeeActualAmountPerUser[receiverIndex];

        if (!payer || !receiver) break;

        // receiver need to paid back to payer
        const amountToPaid = Math.min(receiver.amount, payer.amount);
        const isMoneyLeftInReceiver = receiver.amount > payer.amount;

        if (payer.id !== receiver.id) {
          const currentPaymentRelationship = paymentRelationship.find(
            (i) =>
              (i.payer.id === receiver.id && i.receiver.id === payer.id) ||
              (i.payer.id === payer.id && i.receiver.id === receiver.id),
          );

          if (currentPaymentRelationship) {
            if (currentPaymentRelationship.payer.id === receiver.id) {
              currentPaymentRelationship.requiredAmount += amountToPaid;
            } else {
              currentPaymentRelationship.requiredAmount -= amountToPaid;
            }

            // Reserve the payer and receiver
            if (currentPaymentRelationship.requiredAmount < 0) {
              currentPaymentRelationship.payer = memberById[receiver.id];
              currentPaymentRelationship.receiver = memberById[payer.id];
              currentPaymentRelationship.requiredAmount = Math.abs(
                currentPaymentRelationship.requiredAmount,
              );
            }
          } else {
            paymentRelationship.push({
              payer: memberById[receiver.id],
              receiver: memberById[payer.id],
              requiredAmount: receiver.amount,
            });
          }
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
    {} as Record<CurrencyCode, PaymentRelationship>,
  );

  const netAmountsByCurrency = records.reduce(
    (prev, curr) => {
      prev[curr.currencyCode] = prev[curr.currencyCode] ?? {};

      members.forEach((member) => {
        const relatedAmount = getRelatedAmount(member.id, curr);
        if (!relatedAmount) return;
        prev[curr.currencyCode][member.id] = {
          netAmount:
            relatedAmount.netAmount +
            (prev[curr.currencyCode][member.id]?.netAmount ?? 0),
          member,
        };
      });
      return prev;
    },
    {} as Record<
      CurrencyCode,
      Record<string, { netAmount: number; member: User }>
    >,
  );

  const simplifiedPaymentRelationshipByCurrency = Object.entries(
    netAmountsByCurrency,
  ).reduce(
    (prev, [currencyCode, netAmountsById]) => {
      const netAmounts = Object.values(netAmountsById).sort((a, b) =>
        a.netAmount > b.netAmount ? 1 : -1,
      );

      let receiverIndex = 0;
      let payerIndex = netAmounts.length - 1;

      while (receiverIndex < payerIndex) {
        const receiver = netAmounts[receiverIndex];
        const payer = netAmounts[payerIndex];

        if (!receiver || !payer) break;

        const amountToPaid = Math.min(
          Math.abs(receiver.netAmount),
          Math.abs(payer.netAmount),
        );

        if (amountToPaid === 0) break;

        prev[currencyCode as CurrencyCode] =
          prev[currencyCode as CurrencyCode] ?? [];

        const paymentRelationship = prev[currencyCode as CurrencyCode];

        const currentPaymentRelationship = paymentRelationship.find(
          (i) =>
            i.payer.id === payer.member.id &&
            i.receiver.id === receiver.member.id,
        );

        if (currentPaymentRelationship) {
          if (currentPaymentRelationship.payer.id === receiver.member.id) {
            currentPaymentRelationship.requiredAmount += amountToPaid;
          } else {
            currentPaymentRelationship.requiredAmount -= amountToPaid;
          }

          // Reserve the payer and receiver
          if (currentPaymentRelationship.requiredAmount < 0) {
            currentPaymentRelationship.payer = memberById[receiver.member.id];
            currentPaymentRelationship.receiver = memberById[payer.member.id];
            currentPaymentRelationship.requiredAmount = Math.abs(
              currentPaymentRelationship.requiredAmount,
            );
          }
        } else {
          paymentRelationship.push({
            payer: receiver.member,
            receiver: payer.member,
            requiredAmount: amountToPaid,
          });
        }

        receiver.netAmount += amountToPaid;
        payer.netAmount -= amountToPaid;

        if (Math.round(receiver.netAmount) === 0) receiverIndex++;
        if (Math.round(payer.netAmount) === 0) payerIndex--;
      }

      return prev;
    },
    {} as Record<CurrencyCode, PaymentRelationship>,
  );

  console.log(
    "simplifiedPaymentRelationshipByCurrency",
    JSON.stringify(simplifiedPaymentRelationshipByCurrency, null, 2),
  );

  return {
    paymentRelationshipByCurrency,
    simplifiedPaymentRelationshipByCurrency,
  };
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
