import { AvatarColor } from "./AvatarColor";

export type User = {
  id: string;
  groupId?: string;
  name: string;
  avatarColor: AvatarColor;
};
