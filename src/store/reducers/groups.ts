import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";

import { ICreateGroupPayload } from "@/types/GroupCreate";

export interface GroupsState {
  groups: {
    id: string;
    name: string;
    description?: string;
    members: {
      id: string;
      name: string;
      imageUrl?: string;
    }[];
    paymentRecord: unknown[];
  }[];
}

const initialState: GroupsState = {
  groups: [],
};

export const groupsSlice = createSlice({
  name: "groups",
  initialState,
  reducers: {
    addGroup: (state, action: PayloadAction<ICreateGroupPayload>) => {
      state.groups.push({
        id: uuidv4(),
        paymentRecord: [],
        ...action.payload,
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

    addMember: (
      state,
      action: PayloadAction<{ groupId: string; name: string }>
    ) => {
      console.log("addMember");
      const group = state.groups.find(
        (group) => group.id === action.payload.groupId
      );

      console.log(group);
      if (group) {
        group.members.push({
          id: uuidv4(),
          name: action.payload.name,
        });
      }
    },
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
} = groupsSlice.actions;

export default groupsSlice.reducer;
