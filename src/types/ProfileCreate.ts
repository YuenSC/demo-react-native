import { AvatarColor } from "./AvatarColor";

export type IProfileCreatePayload = {
  name: string;
  avatarColor?: AvatarColor;
};
