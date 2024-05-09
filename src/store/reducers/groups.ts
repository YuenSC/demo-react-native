import {
  createSelector,
  createSlice,
  PayloadAction,
  weakMapMemoize,
} from "@reduxjs/toolkit";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";

import { RootState } from "..";

import { CurrencyCode } from "@/types/Currency";
import { IGroupCreatePayload } from "@/types/GroupCreate";
import { IGroupEditPayload } from "@/types/GroupEdit";
import { PaymentRecord, PaymentRecordCreate } from "@/types/PaymentRecord";

export interface Group {
  id: string;
  name: string;
  description?: string;
  paymentRecords: PaymentRecord[];
}

export interface GroupsState {
  groups: Group[];
  suggestedCurrencyCodes?: CurrencyCode[];
  lastUsedCurrency?: CurrencyCode;
  currentGroupId?: string;
}

const initialState: GroupsState = {
  groups: [],
  suggestedCurrencyCodes: [],
  lastUsedCurrency: undefined,
  currentGroupId: undefined,
};

export const groupsSlice = createSlice({
  name: "groups",
  initialState,
  reducers: {
    addGroup: (state, action: PayloadAction<IGroupCreatePayload>) => {
      state.groups.push({
        id: uuidv4(),
        paymentRecords: [],
        ...action.payload,
        name: action.payload.name.trim(),
      });

      if (state.groups.length === 1) {
        state.currentGroupId = state.groups[0].id;
      }
    },
    deleteGroup: (state, action: PayloadAction<{ id: string }>) => {
      state.groups = state.groups.filter(
        (group) => group.id !== action.payload.id,
      );

      if (state.currentGroupId === action.payload.id) {
        state.currentGroupId = state.groups[0]?.id;
      }
    },
    updateGroup: (state, action: PayloadAction<IGroupEditPayload>) => {
      const group = state.groups.find(
        (group) => group.id === action.payload.id,
      );
      if (group) {
        group.name = action.payload.name;
        group.description = action.payload.description;
      }
    },
    addPaymentRecord: (state, action: PayloadAction<PaymentRecordCreate>) => {
      const currentGroup = state.groups.find(
        (group) => group.id === action.payload.groupId,
      );
      if (!currentGroup) return;

      currentGroup.paymentRecords.push({
        ...action.payload,
        id: uuidv4(),
      });
    },
    deletePaymentRecord: (
      state,
      action: PayloadAction<{
        groupId: string;
        recordId: string;
      }>,
    ) => {
      const group = state.groups.find(
        (group) => group.id === action.payload.groupId,
      );

      if (!group) return;

      group.paymentRecords = group.paymentRecords.filter(
        (record) => record.id !== action.payload.recordId,
      );
    },
    updatePaymentRecord: (state, action: PayloadAction<PaymentRecord>) => {
      const group = state.groups.find(
        (group) => group.id === action.payload.groupId,
      );
      if (group) {
        const record = group.paymentRecords.find(
          (record) => record.id === action.payload.id,
        );

        if (record) {
          record.amount = action.payload.amount;
          record.category = action.payload.category;
          record.comment = action.payload.comment;
          record.currencyCode = action.payload.currencyCode;
          record.date = action.payload.date;
          record.payees = action.payload.payees;
          record.payers = action.payload.payers;
        }
      }
    },
    addCurrencyCodeSuggestion: (state, action: PayloadAction<CurrencyCode>) => {
      state.lastUsedCurrency = action.payload;

      if (!state.suggestedCurrencyCodes) {
        state.suggestedCurrencyCodes = [action.payload];
        return;
      }

      state.suggestedCurrencyCodes.push(action.payload);
    },
    deleteCurrencyCodeSuggestion: (
      state,
      action: PayloadAction<CurrencyCode>,
    ) => {
      state.suggestedCurrencyCodes = (
        state.suggestedCurrencyCodes ?? []
      ).filter((item) => item !== action.payload);
    },

    setCurrentGroupId: (state, action: PayloadAction<string>) => {
      state.currentGroupId = action.payload;
    },
  },
});

export const {
  addGroup,
  addPaymentRecord,
  deleteGroup,
  deletePaymentRecord,
  updateGroup,
  updatePaymentRecord,
  addCurrencyCodeSuggestion,
  deleteCurrencyCodeSuggestion,
  setCurrentGroupId,
} = groupsSlice.actions;

export default groupsSlice.reducer;

export const currentGroupSelector = createSelector(
  [
    (state: RootState) => state.groups.groups,
    (state: RootState) => state.groups.currentGroupId,
  ],
  (groups, currentGroupId) =>
    groups.find((group) => group.id === currentGroupId),
  {
    memoize: weakMapMemoize,
    argsMemoize: weakMapMemoize,
  },
);

export const groupSelector = createSelector(
  [
    (state: RootState) => state.groups.groups,
    (state: RootState, groupId: string) => groupId,
  ],
  (groups, groupId) => groups.find((group) => group.id === groupId),
  {
    memoize: weakMapMemoize,
    argsMemoize: weakMapMemoize,
  },
);

export const relatedPaymentsSelector = createSelector(
  [
    (state: RootState) => state.groups.groups,
    (_: RootState, userId: string) => userId,
    (_: RootState, userId: string, groupId?: string) => groupId,
  ],
  (groups, userId, groupId) => {
    const paymentRecordsFromGroupId =
      groups.find((group) => group.id === groupId)?.paymentRecords ?? [];
    const paymentRecordsFromAllGroups = groups.reduce((acc, group) => {
      return [...acc, ...group.paymentRecords];
    }, [] as PaymentRecord[]);

    const paymentRecords = groupId
      ? paymentRecordsFromGroupId
      : paymentRecordsFromAllGroups;

    const relatedPaymentRecords =
      paymentRecords.filter(
        (record) =>
          record.payees.find((payee) => payee.id === userId) ||
          record.payers.find((payer) => payer.id === userId),
      ) ?? [];
    return relatedPaymentRecords;
  },
  {
    memoize: weakMapMemoize,
    argsMemoize: weakMapMemoize,
  },
);

export const groupNameByIdSelector = createSelector(
  [(state: RootState) => state.groups.groups],
  (groups) =>
    groups.reduce(
      (acc, group) => {
        acc[group.id] = group.name;
        return acc;
      },
      {} as Record<string, string>,
    ),
  {
    memoize: weakMapMemoize,
    argsMemoize: weakMapMemoize,
  },
);
