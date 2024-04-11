import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootState } from "..";

export type ProfileState = {
  userId?: string;
};

const initialState: ProfileState = {};

export const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    updateProfile: (state, action: PayloadAction<string>) => {
      state.userId = action.payload;
    },
  },
});

export const { updateProfile } = profileSlice.actions;

export default profileSlice.reducer;

export const profileUserSelector = (state: RootState) => {
  return state.users.users.find((user) => user.id === state.profile.userId);
};
