import {
  PayloadAction,
  createSelector,
  createSlice,
  weakMapMemoize,
} from "@reduxjs/toolkit";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";

import { RootState } from "..";

import { IUserCreatePayload, IUserUpdatePayload, User } from "@/types/User";

export type UsersState = {
  users: User[];
};

const initialState: UsersState = {
  users: [],
};

export const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    addUser: (state, action: PayloadAction<IUserCreatePayload>) => {
      const id = uuidv4();
      state.users.push({
        ...action.payload,
        id: action.payload.id ?? id,
      });
    },
    removeUserFromGroup: (
      state,
      action: PayloadAction<{ id: string; groupId: string }>,
    ) => {
      const user = state.users.find((user) => user.id === action.payload.id);
      if (!user) return;

      user.groupIds = user.groupIds.filter(
        (groupId) => groupId !== action.payload.groupId,
      );
    },
    addUserToGroup: (
      state,
      action: PayloadAction<{ id: string; groupId: string }>,
    ) => {
      const user = state.users.find((user) => user.id === action.payload.id);
      if (!user) return;

      if (!user.groupIds.includes(action.payload.groupId)) {
        user.groupIds.push(action.payload.groupId);
      }
    },
    deleteUser: (state, action: PayloadAction<string>) => {
      const index = state.users.findIndex((user) => user.id === action.payload);
      if (index !== -1) {
        state.users.splice(index, 1);
      }
    },
    updateUser: (state, action: PayloadAction<IUserUpdatePayload>) => {
      const user = state.users.find((user) => user.id === action.payload.id);
      if (user) {
        user.groupIds = action.payload.groupIds ?? user.groupIds;
        user.name = action.payload.name ?? user.name;
        user.groupIds = action.payload.groupIds ?? user.groupIds;
        user.avatarColor = action.payload.avatarColor ?? user.avatarColor;
      }
    },
  },
});

export const {
  addUser,
  removeUserFromGroup,
  updateUser,
  addUserToGroup,
  deleteUser,
} = usersSlice.actions;

export default usersSlice.reducer;

export const groupUsersSelector = createSelector(
  [
    (state: RootState) => state.users.users,
    (_: RootState, groupId: string) => groupId,
  ],
  (users, groupId) => users.filter((user) => user.groupIds?.includes(groupId)),
  {
    memoize: weakMapMemoize,
    argsMemoize: weakMapMemoize,
  },
);

export const userSelector = createSelector(
  [
    (state: RootState) => state.users.users,
    (_: RootState, userId?: string) => userId,
  ],
  (users, userId) => users.find((user) => user.id === userId),
  {
    memoize: weakMapMemoize,
    argsMemoize: weakMapMemoize,
  },
);
