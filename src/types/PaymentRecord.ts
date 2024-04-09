import { CurrencyCode } from "./Currency";

export type PaymentDetail = {
  id: string;
  amount: number | "auto";
};

export type PaymentRecord = {
  id: string;
  groupId: string;
  amount: number;
  currencyCode: CurrencyCode;
  comment: string;
  date: string;
  category: string;
  payers: PaymentDetail[];
  payees: PaymentDetail[];
};

export type PaymentRecordCreate = Omit<PaymentRecord, "id"> & {
  id?: string;
};
