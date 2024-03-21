import { CurrencyCode } from "./Currency";

export type PaymentRecord = {
  id: string;
  groupId: string;
  amount: number;
  currencyCode: CurrencyCode;
  comment: string;
  date: string;
  category: string;
  payers: { id: string; amount: number | "auto" }[];
  payees: { id: string; amount: number | "auto" }[];
};

export type PaymentRecordCreate = Omit<PaymentRecord, "id">;
