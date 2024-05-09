import {
  createSelector,
  createSlice,
  PayloadAction,
  weakMapMemoize,
} from "@reduxjs/toolkit";

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

export const profileUserSelector = createSelector(
  [
    (state: RootState) => state.users.users,
    (state: RootState) => state.profile.userId,
  ],
  (users, profileUserId) => users.find((user) => user.id === profileUserId),
  {
    memoize: weakMapMemoize,
    argsMemoize: weakMapMemoize,
  },
);
