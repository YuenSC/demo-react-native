import { User } from "./User";

export type IGroupCreatePayload = {
  id?: string;
  name: string;
  description: string;
  members: User[];
};
