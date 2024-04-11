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
    deleteUser: (
      state,
      action: PayloadAction<{ id: string; groupIds: string[] }>,
    ) => {
      state.users = state.users.filter((user) => user.id !== action.payload.id);
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

export const { addUser, deleteUser, updateUser } = usersSlice.actions;

export default usersSlice.reducer;

// export const groupUsersSelector = (state: RootState, groupId: string) => {
//   return state.users.users.filter((user) => user.groupIds?.includes(groupId));
// };

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

export const userSelector = (state: RootState, userId?: string) => {
  return state.users.users.find((user) => user.id === userId);
};
