import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";

import { CurrencyCode } from "@/types/Currency";
import { ICreateGroupPayload } from "@/types/GroupCreate";
import { PaymentRecord, PaymentRecordCreate } from "@/types/PaymentRecord";

export interface Group {
  id: string;
  name: string;
  description?: string;
  members: {
    id: string;
    name: string;
    imageUrl?: string;
  }[];
  paymentRecords: PaymentRecord[];
}

export interface GroupsState {
  groups: Group[];
  suggestedCurrencyCodes?: CurrencyCode[];
  lastUsedCurrency?: CurrencyCode;
}

const initialState: GroupsState = {
  groups: [],
  suggestedCurrencyCodes: [],
  lastUsedCurrency: undefined,
};

export const groupsSlice = createSlice({
  name: "groups",
  initialState,
  reducers: {
    addGroup: (state, action: PayloadAction<ICreateGroupPayload>) => {
      state.groups.push({
        id: uuidv4(),
        paymentRecords: [],
        ...action.payload,
      });
    },
    deleteGroup: (state, action: PayloadAction<{ id: string }>) => {
      state.groups = state.groups.filter(
        (group) => group.id !== action.payload.id,
      );
    },
    updateGroup: () => {},

    addPaymentRecord: (state, action: PayloadAction<PaymentRecordCreate>) => {
      const currentGroup = state.groups.find(
        (group) => group.id === action.payload.groupId,
      );
      if (!currentGroup) return;

      currentGroup.paymentRecords.push({
        id: uuidv4(),
        ...action.payload,
      });
    },
    deletePaymentRecord: () => {},
    updatePaymentRecord: () => {},

    addMember: (
      state,
      action: PayloadAction<{ groupId: string; name: string }>,
    ) => {
      const group = state.groups.find(
        (group) => group.id === action.payload.groupId,
      );

      if (group) {
        group.members.push({
          id: uuidv4(),
          name: action.payload.name,
        });
      }
    },
    deleteMember: (
      state,
      action: PayloadAction<{ groupId: string; memberId: string }>,
    ) => {
      const group = state.groups.find(
        (group) => group.id === action.payload.groupId,
      );

      if (group) {
        group.members = group.members.filter(
          (member) => member.id !== action.payload.memberId,
        );
      }
    },

    updateMember: (
      state,
      action: PayloadAction<{
        groupId: string;
        memberId: string;
        name: string;
      }>,
    ) => {
      const group = state.groups.find(
        (group) => group.id === action.payload.groupId,
      );
      if (group) {
        const member = group.members.find(
          (member) => member.id === action.payload.memberId,
        );
        console.log("member", member);
        if (member) {
          member.name = action.payload.name;
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
  },
});

export const {
  addGroup,
  addMember,
  addPaymentRecord,
  deleteGroup,
  deleteMember,
  deletePaymentRecord,
  updateGroup,
  updateMember,
  updatePaymentRecord,
  addCurrencyCodeSuggestion,
  deleteCurrencyCodeSuggestion,
} = groupsSlice.actions;

export default groupsSlice.reducer;
