import { AvatarColor } from "./AvatarColor";

export type User = {
  id: string;
  groupIds: string[];
  name: string;
  avatarColor: AvatarColor;
};

export type IUserCreatePayload = Omit<User, "id"> & {
  id?: string;
};

export type IUserUpdatePayload = Partial<IUserCreatePayload> & { id: string };
