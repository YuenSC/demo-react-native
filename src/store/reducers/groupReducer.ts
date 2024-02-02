import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";

import { ICreateGroupPayload } from "@/types/GroupCreate";

export interface GroupState {
  groups: {
    id: string;
    name: string;
    description?: string;
    members: {
      name: string;
      imageUrl?: string;
    }[];
    paymentRecord: unknown[];
  }[];
}

const initialState: GroupState = {
  groups: [],
};

export const groupSlice = createSlice({
  name: "group",
  initialState,
  reducers: {
    addGroup: (state, action: PayloadAction<ICreateGroupPayload>) => {
      state.groups.push({
        id: uuidv4(),
        ...action.payload,
        paymentRecord: [],
      });
    },
    deleteGroup: (state, action: PayloadAction<{ id: string }>) => {
      state.groups = state.groups.filter(
        (group) => group.id !== action.payload.id
      );
    },
    updateGroup: () => {},

    addPaymentRecord: () => {},
    deletePaymentRecord: () => {},
    updatePaymentRecord: () => {},

    addMember: () => {},
    deleteMember: () => {},
    updateMember: () => {},
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
} = groupSlice.actions;

export default groupSlice.reducer;
