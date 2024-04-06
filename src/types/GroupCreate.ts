import { User } from "./User";

export type ICreateGroupPayload = {
  id?: string;
  name: string;
  description: string;
  members: User[];
};
