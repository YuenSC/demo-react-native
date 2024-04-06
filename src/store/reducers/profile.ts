import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";

import { IProfileCreatePayload } from "@/types/ProfileCreate";
import { User } from "@/types/User";

export type ProfileState = Partial<User>;

const initialState: ProfileState = {};

export const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    updateProfile: (state, action: PayloadAction<IProfileCreatePayload>) => {
      if (!state.id) {
        state.id = uuidv4();
      }
      state.name = action.payload.name;
      state.avatarColor = action.payload.avatarColor;
    },
  },
});

export const { updateProfile } = profileSlice.actions;

export default profileSlice.reducer;
