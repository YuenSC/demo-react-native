import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";

import { RootState } from "..";

import { CurrencyCode } from "@/types/Currency";
import { IGroupCreatePayload } from "@/types/GroupCreate";
import { IGroupEditPayload } from "@/types/GroupEdit";
import { IGroupMemberCreatePayload } from "@/types/GroupMemberCreate";
import { PaymentRecord, PaymentRecordCreate } from "@/types/PaymentRecord";
import { User } from "@/types/User";

export interface Group {
  id: string;
  name: string;
  description?: string;
  members: User[];
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
      });

      if (state.groups.length === 1) {
        state.currentGroupId = state.groups[0].id;
      }
    },
    deleteGroup: (state, action: PayloadAction<{ id: string }>) => {
      state.groups = state.groups.filter(
        (group) => group.id !== action.payload.id,
      );
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

    addExistingUserInGroup: (state, action: PayloadAction<User>) => {
      const group = state.groups.find(
        (group) => group.id === action.payload.groupId,
      );
      if (group) {
        group.members.push(action.payload);
      }
    },
    addMember: (state, action: PayloadAction<IGroupMemberCreatePayload>) => {
      const group = state.groups.find(
        (group) => group.id === action.payload.groupId,
      );

      if (group) {
        group.members.push({
          id: uuidv4(),
          name: action.payload.name,
          avatarColor: action.payload.avatarColor,
        });
      }
    },
    deleteMember: (
      state,
      action: PayloadAction<{ groupId: string; userId: string }>,
    ) => {
      const group = state.groups.find(
        (group) => group.id === action.payload.groupId,
      );
      const relatedPaymentRecords =
        group?.paymentRecords.filter(
          (record) =>
            record.payees.find((payee) => payee.id === action.payload.userId) ||
            record.payers.find((payer) => payer.id === action.payload.userId),
        ) ?? [];
      if (!group) return;
      if (relatedPaymentRecords.length > 0) return;

      group.members = group.members.filter(
        (member) => member.id !== action.payload.userId,
      );
    },

    updateMember: (state, action: PayloadAction<Partial<User>>) => {
      const group = state.groups.find(
        (group) => group.id === action.payload.groupId,
      );
      if (group) {
        const member = group.members.find(
          (member) => member.id === action.payload.id,
        );
        if (member) {
          member.name = action.payload.name || member.name;
          member.avatarColor = action.payload.avatarColor || member.avatarColor;
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
  addMember,
  addExistingUserInGroup,
  addPaymentRecord,
  deleteGroup,
  deleteMember,
  deletePaymentRecord,
  updateGroup,
  updateMember,
  updatePaymentRecord,
  addCurrencyCodeSuggestion,
  deleteCurrencyCodeSuggestion,
  setCurrentGroupId,
} = groupsSlice.actions;

export default groupsSlice.reducer;

export const currentGroupSelector = (state: RootState) =>
  state.groups.groups.find((group) => group.id === state.groups.currentGroupId);

export const groupSelector = (state: RootState, groupId: string) =>
  state.groups.groups.find((group) => group.id === groupId);

export const memberSelector = (
  state: RootState,
  groupId: string,
  userId: string,
) => {
  const group = state.groups.groups.find((group) => group.id === groupId);
  return group?.members.find((member) => member.id === userId);
};

export const relatedPaymentsSelector = (
  state: RootState,
  groupId: string,
  userId: string,
) => {
  const group = state.groups.groups.find((group) => group.id === groupId);
  const relatedPaymentRecords =
    group?.paymentRecords.filter(
      (record) =>
        record.payees.find((payee) => payee.id === userId) ||
        record.payers.find((payer) => payer.id === userId),
    ) ?? [];
  return relatedPaymentRecords;
};
