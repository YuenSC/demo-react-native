import { PaymentDetail, PaymentRecord } from "@/types/PaymentRecord";

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
    amount:
      i.amount === "auto"
        ? parseFloat(autoSplitAmount.toFixed(2))
        : i.amount ?? 0,
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
