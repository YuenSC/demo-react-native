import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";

export interface ProfileState {
  id?: string;
  name?: string;
}

const initialState: ProfileState = {};

export const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    updateProfile: (state, action: PayloadAction<{ name: string }>) => {
      if (!state.id) {
        state.id = uuidv4();
      }
      state.name = action.payload.name;
    },
  },
});

export const { updateProfile } = profileSlice.actions;

export default profileSlice.reducer;
