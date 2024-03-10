import { CurrencyCode } from "./Currency";

export type PaymentRecord = {
  id: string;
  groupId: string;
  amount: number;
  currencyCode: CurrencyCode;
  comment: string;
  date: string;
  category: string;
};

export type PaymentRecordCreate = Omit<PaymentRecord, "id">;
